import type { SvnClient } from '../client.js';
import type { Depth } from '../types.js';
import { parseCommitRevision } from '../parse/text.js';

export interface CommitOptions {
    depth?: Depth;
    targets?: string;
    noUnlock?: boolean;
    message?: string;
    file?: string;
    forceLog?: boolean;
    editorCmd?: string;
    encoding?: string;
    withRevprop?: string;
    changelist?: string | string[];
    keepChangelists?: boolean;
    includeExternals?: boolean;
}

export async function commit(
    client: SvnClient,
    paths?: string[],
    opts?: CommitOptions,
): Promise<{ revision: number }> {
    const args: string[] = [];

    if (opts?.depth) {
        args.push('--depth', opts.depth);
    }

    if (opts?.targets) {
        args.push('--targets', opts.targets);
    }

    if (opts?.noUnlock) {
        args.push('--no-unlock');
    }

    if (opts?.message !== undefined) {
        args.push('-m', opts.message);
    }

    if (opts?.file !== undefined) {
        args.push('-F', opts.file);
    }

    if (opts?.forceLog) {
        args.push('--force-log');
    }

    if (opts?.editorCmd) {
        args.push('--editor-cmd', opts.editorCmd);
    }

    if (opts?.encoding) {
        args.push('--encoding', opts.encoding);
    }

    if (opts?.withRevprop) {
        args.push('--with-revprop', opts.withRevprop);
    }

    if (opts?.changelist) {
        const changelists = Array.isArray(opts.changelist) ? opts.changelist : [opts.changelist];
        for (const cl of changelists) {
            args.push('--changelist', cl);
        }
    }

    if (opts?.keepChangelists) {
        args.push('--keep-changelists');
    }

    if (opts?.includeExternals) {
        args.push('--include-externals');
    }

    if (paths) {
        args.push(...paths);
    }

    const result = await client.exec('commit', args);
    const revision = parseCommitRevision(result.stdout);
    return { revision };
}
