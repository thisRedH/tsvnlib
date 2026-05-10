import type { SvnClient } from '../client.js';
import type { RevisionArg, RevisionRange, Depth } from '../types.js';
import { serializeRevisionArg } from '../args.js';
import { parseLogXml } from '../parse/log.js';
import type { LogEntry, LogPathEntry } from '../parse/log.js';

export type { LogEntry, LogPathEntry };

export interface LogOptions {
    revision?: RevisionArg | RevisionRange;
    change?: string;
    quiet?: boolean;
    verbose?: boolean;
    useMergeHistory?: boolean;
    targets?: string;
    stopOnCopy?: boolean;
    incremental?: boolean;
    limit?: number;
    withAllRevprops?: boolean;
    withNoRevprops?: boolean;
    withRevprop?: string | string[];
    depth?: Depth;
    diff?: boolean;
    diffCmd?: string;
    internalDiff?: boolean;
    extensions?: string;
    search?: string;
    searchAnd?: string | string[];
}

export async function log(
    client: SvnClient,
    target?: string,
    paths?: string[],
    opts?: LogOptions,
): Promise<LogEntry[]> {
    const args: string[] = ['--xml'];

    if (opts?.revision !== undefined) {
        args.push('-r', serializeRevisionArg(opts.revision));
    }

    if (opts?.change !== undefined) {
        args.push('--change', opts.change);
    }

    if (opts?.quiet) {
        args.push('-q');
    }

    if (opts?.verbose) {
        args.push('-v');
    }

    if (opts?.useMergeHistory) {
        args.push('--use-merge-history');
    }

    if (opts?.targets) {
        args.push('--targets', opts.targets);
    }

    if (opts?.stopOnCopy) {
        args.push('--stop-on-copy');
    }

    if (opts?.incremental) {
        args.push('--incremental');
    }

    if (opts?.limit !== undefined) {
        args.push('--limit', String(opts.limit));
    }

    if (opts?.withAllRevprops) {
        args.push('--with-all-revprops');
    }

    if (opts?.withNoRevprops) {
        args.push('--with-no-revprops');
    }

    if (opts?.withRevprop) {
        const withRevprop = Array.isArray(opts.withRevprop) ? opts.withRevprop : [opts.withRevprop];
        for (const rp of withRevprop) {
            args.push('--with-revprop', rp);
        }
    }

    if (opts?.depth) {
        args.push('--depth', opts.depth);
    }

    if (opts?.diff) {
        args.push('--diff');
    }

    if (opts?.diffCmd) {
        args.push('--diff-cmd', opts.diffCmd);
    }

    if (opts?.internalDiff) {
        args.push('--internal-diff');
    }

    if (opts?.extensions !== undefined) {
        args.push('-x', opts.extensions);
    }

    if (opts?.search) {
        args.push('--search', opts.search);
    }

    if (opts?.searchAnd) {
        const searchAnd = Array.isArray(opts.searchAnd) ? opts.searchAnd : [opts.searchAnd];
        for (const s of searchAnd) {
            args.push('--search-and', s);
        }
    }

    if (target) {
        args.push(target);

        if (paths && paths.length > 0) {
            args.push('--', ...paths);
        }
    }

    const result = await client.exec('log', args);
    return parseLogXml(result.stdout);
}
