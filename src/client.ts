import { type Logger, noopLogger } from './logger/index.js';
import { parseSvnStderr, SvnProcessError } from './error/index.js';
import { buildArgs, type BuildArgValue } from './args.js';
import * as commands from './commands/index.js';
import type { GlobalOptions } from './types.js';
import type { Runner, RunOptions, RunResult } from './runners/index.js';

export type * from './commands/index.js';

export interface ExecOptions {
    stdin?: Uint8Array | string;
    env?: Record<string, string>;
    cwd?: string;
    onStdout?: (chunk: Uint8Array) => void;
    onStderr?: (chunk: Uint8Array) => void;
    signal?: AbortSignal;
    binary?: boolean;
    noGlobalArgs?: boolean;
}

export interface ExecResult {
    stdout: string;
    stderr: string;
    exitCode: number;
}

export interface ExecBinaryResult {
    stdout: Uint8Array;
    stderr: string;
    exitCode: number;
}

function redactArgs(args: string[]): string[] {
    const result = [...args];
    for (let i = 0; i < result.length - 1; i++) {
        if (result[i] === '--password') {
            result[i + 1] = '***';
        }
    }
    return result;
}

function getProcessEnv(): Record<string, string> {
    if (process?.env && typeof process.env === 'object') {
        const env: Record<string, string> = {};
        for (const [k, v] of Object.entries(process.env)) {
            if (v !== undefined) {
                env[k] = v as string;
            }
        }
        return env;
    } else {
        return {};
    }
}

const decoder = new TextDecoder();

export class SvnClient {
    protected readonly logger: Logger;

    constructor(
        protected readonly runner: Runner,
        protected readonly config: {
            svnExecutable?: string;
            repoUrl?: string;
            cwd?: string;
            logger?: Logger;
        } & GlobalOptions
    ) {
        this.logger = config.logger ?? noopLogger;
    }

    protected buildGlobalArgs(): string[] {
        const args: string[] = [];

        if (this.config.username) {
            args.push('--username', this.config.username);
        }

        if (this.config.password) {
            args.push('--password', this.config.password);
        }

        if (this.config.passwordFromStdin) {
            args.push('--password-from-stdin');
        }

        if (this.config.noAuthCache) {
            args.push('--no-auth-cache');
        }

        if (this.config.nonInteractive) {
            args.push('--non-interactive');
        }

        if (this.config.forceInteractive) {
            args.push('--force-interactive');
        }

        if (this.config.trustServerCertFailures?.length) {
            args.push('--trust-server-cert-failures', this.config.trustServerCertFailures.join(','));
        }

        if (this.config.configDir) {
            args.push('--config-dir', this.config.configDir);
        }

        if (this.config.configOption) {
            args.push('--config-option', this.config.configOption);
        }

        return args;
    }

    async exec(subcommand: string, args: string[], opts?: ExecOptions & { binary?: false }): Promise<ExecResult>;
    async exec(subcommand: string, args: string[], opts: ExecOptions & { binary: true }): Promise<ExecBinaryResult>;
    async exec(subcommand: string, args: string[], opts?: ExecOptions): Promise<ExecResult | ExecBinaryResult> {
        const fullArgs = opts?.noGlobalArgs
            ? [subcommand, ...args]
            : [subcommand, ...this.buildGlobalArgs(), ...args];

        const env: Record<string, string> = {
            ...getProcessEnv(),
            ...(opts?.env ?? {})
        };

        const cwd = opts?.cwd ?? this.config.cwd;

        const runOpts: RunOptions = {
            stdin: opts?.stdin,
            env,
            cwd: cwd,
            onStdout: opts?.onStdout,
            onStderr: opts?.onStderr,
            signal: opts?.signal,
        };

        this.logger.debug(this.svnExecutable, redactArgs(fullArgs), `(in '${cwd}')`);

        let result: RunResult;
        try {
            result = await this.runner(this.svnExecutable, fullArgs, runOpts);
        } catch (err) {
            this.logger.error('svn command failed to spawn:', err);
            throw err;
        }

        const stderrText = decoder.decode(result.stderr);
        if (stderrText) {
            this.logger.warn('svn stderr:', stderrText);
        }

        if (result.exitCode !== 0) {
            this.logger.error('svn exited with code %d: %s', result.exitCode, stderrText || '(no stderr)');
            const svnErr = parseSvnStderr(stderrText);
            if (svnErr) {
                throw svnErr;
            } else {
                throw new SvnProcessError(result.exitCode, stderrText);
            }
        }

        if (opts?.binary) {
            return {
                stdout: result.stdout,
                stderr: stderrText,
                exitCode: result.exitCode,
            } satisfies ExecBinaryResult;
        } else {
            return {
                stdout: decoder.decode(result.stdout),
                stderr: stderrText,
                exitCode: result.exitCode,
            } satisfies ExecResult;
        }
    }

    buildArgs(opts: Record<string, unknown>): string[] {
        return buildArgs(opts as Record<string, BuildArgValue>);
    }

    get repoUrl(): string | undefined {
        return this.config.repoUrl;
    }

    get cwd(): string | undefined {
        return this.config.cwd;
    }

    get svnExecutable(): string {
        return this.config.svnExecutable ?? 'svn';
    }

    // === Commands ===

    add(paths: string[], opts?: commands.AddOptions): Promise<void> {
        return commands.add(this, paths, opts);
    }

    auth(patterns?: string[], opts?: commands.AuthOptions): Promise<string> {
        return commands.auth(this, patterns, opts);
    }

    blame(targets: string[], opts?: commands.BlameOptions): Promise<commands.BlameEntry[]> {
        return commands.blame(this, targets, opts);
    }

    cat(targets: string[], opts?: commands.CatOptions): Promise<Uint8Array> {
        return commands.cat(this, targets, opts);
    }

    changelist(clname: string | null, paths: string[], opts?: commands.ChangelistOptions): Promise<void> {
        return commands.changelist(this, clname, paths, opts);
    }

    checkout(urls: string[], path?: string, opts?: commands.CheckoutOptions): Promise<void> {
        return commands.checkout(this, urls, path, opts);
    }

    cleanup(paths?: string[], opts?: commands.CleanupOptions): Promise<void> {
        return commands.cleanup(this, paths, opts);
    }

    commit(paths?: string[], opts?: commands.CommitOptions): Promise<{ revision: number }> {
        return commands.commit(this, paths, opts);
    }

    copy(srcs: string[], dst: string, opts?: commands.CopyOptions): Promise<void> {
        return commands.copy(this, srcs, dst, opts);
    }

    delete(targets: string[], opts?: commands.DeleteOptions): Promise<void> {
        return commands.delete_(this, targets, opts);
    }

    diff(targets: string[], opts: commands.DiffOptions & { summarize: true }): Promise<commands.DiffSummaryEntry[]>;
    diff(targets?: string[], opts?: commands.DiffOptions): Promise<string>;
    diff(targets?: string[], opts?: commands.DiffOptions): Promise<commands.DiffSummaryEntry[] | string> {
        if (opts?.summarize) {
            return commands.diff(this, targets ?? [], opts as commands.DiffOptions & { summarize: true });
        } else {
            return commands.diff(this, targets, opts);
        }
    }

    export(src: string, dst?: string, opts?: commands.ExportOptions): Promise<void> {
        return commands.export_(this, src, dst, opts);
    }

    import(path: string, url: string, opts?: commands.ImportOptions): Promise<{ revision: number }> {
        return commands.import_(this, path, url, opts);
    }

    info(targets: string[], opts: commands.InfoOptions & { showItem: commands.InfoShowItem }): Promise<string>;
    info(targets?: string[], opts?: commands.InfoOptions): Promise<commands.InfoEntry[]>;
    info(targets?: string[], opts?: commands.InfoOptions): Promise<commands.InfoEntry[] | string> {
        if (opts?.showItem) {
            return commands.info(this, targets ?? [], opts as commands.InfoOptions & { showItem: commands.InfoShowItem });
        } else {
            return commands.info(this, targets, opts);
        }
    }

    list(targets?: string[], opts?: commands.ListOptions): Promise<Map<string, commands.ListEntry[]>> {
        return commands.list(this, targets, opts);
    }

    lock(targets: string[], opts?: commands.LockOptions): Promise<void> {
        return commands.lock(this, targets, opts);
    }

    log(target?: string, paths?: string[], opts?: commands.LogOptions): Promise<commands.LogEntry[]> {
        return commands.log(this, target, paths, opts);
    }

    merge(source: string, targetWcPath?: string, opts?: commands.MergeOptions): Promise<void> {
        return commands.merge(this, source, targetWcPath, opts);
    }

    merge2URL(source1: string, source2: string, targetWcPath?: string, opts?: commands.MergeOptions): Promise<void> {
        return commands.merge2URL(this, source1, source2, targetWcPath, opts);
    }

    mergeinfo(source: string, target?: string, opts?: commands.MergeinfoOptions): Promise<string> {
        return commands.mergeinfo(this, source, target, opts);
    }

    mkdir(targets: string[], opts?: commands.MkdirOptions): Promise<void> {
        return commands.mkdir(this, targets, opts);
    }

    move(srcs: string[], dst: string, opts?: commands.MoveOptions): Promise<void> {
        return commands.move(this, srcs, dst, opts);
    }

    patch(patchFile: string, wcPath?: string, opts?: commands.PatchOptions): Promise<void> {
        return commands.patch(this, patchFile, wcPath, opts);
    }

    propdel(propname: string, targets?: string[], opts?: commands.PropddelOptions): Promise<void> {
        return commands.propdel(this, propname, targets, opts);
    }

    propedit(propname: string, targets: string[], opts?: commands.PropeditOptions): Promise<void> {
        return commands.propedit(this, propname, targets, opts);
    }

    propget(propname: string, targets?: string[], opts?: commands.PropgetOptions): Promise<string> {
        return commands.propget(this, propname, targets, opts);
    }

    proplist(targets?: string[], opts?: commands.ProplistOptions): Promise<Map<string, commands.PropEntry[]>> {
        return commands.proplist(this, targets, opts);
    }

    propset(propname: string, value: string, targets: string[], opts?: commands.PropsetOptions): Promise<void> {
        return commands.propset(this, propname, value, targets, opts);
    }

    relocate(fromPrefixOrToUrl: string, toPrefixOrPath?: string, paths?: string[], opts?: commands.RelocateOptions): Promise<void> {
        return commands.relocate(this, fromPrefixOrToUrl, toPrefixOrPath, paths, opts);
    }

    resolve(paths?: string[], opts?: commands.ResolveOptions): Promise<void> {
        return commands.resolve(this, paths, opts);
    }

    revert(paths: string[], opts?: commands.RevertOptions): Promise<void> {
        return commands.revert(this, paths, opts);
    }

    status(paths?: string[], opts?: commands.StatusOptions): Promise<commands.StatusEntry[]> {
        return commands.status(this, paths, opts);
    }

    switch(url: string, path?: string, opts?: commands.SwitchOptions): Promise<void> {
        return commands.switch_(this, url, path, opts);
    }

    unlock(targets: string[], opts?: commands.UnlockOptions): Promise<void> {
        return commands.unlock(this, targets, opts);
    }

    update(paths?: string[], opts?: commands.UpdateOptions): Promise<{ revision: number }> {
        return commands.update(this, paths, opts);
    }

    upgrade(paths?: string[], opts?: commands.UpgradeOptions): Promise<void> {
        return commands.upgrade(this, paths, opts);
    }

    help(subcommands?: string[]): Promise<string> {
        return commands.help(this, subcommands);
    }

    version(): Promise<commands.SvnVersion> {
        return commands.version(this);
    }
}
