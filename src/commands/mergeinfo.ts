import type { SvnClient } from '../client.js';
import type { RevisionArg, RevisionRange, Depth } from '../types.js';
import { serializeRevisionArg } from '../args.js';

export interface MergeinfoOptions {
    revision?: RevisionArg | RevisionRange;
    recursive?: boolean;
    quiet?: boolean;
    verbose?: boolean;
    depth?: Depth;
    showRevs?: 'merged' | 'eligible';
    log?: boolean;
    incremental?: boolean;
}

export async function mergeinfo(
    client: SvnClient,
    source: string,
    target?: string,
    opts?: MergeinfoOptions,
): Promise<string> {
    const args: string[] = [];

    if (opts?.revision !== undefined) {
        args.push('-r', serializeRevisionArg(opts.revision));
    }

    if (opts?.recursive) {
        args.push('-R');
    }

    if (opts?.quiet) {
        args.push('-q');
    }

    if (opts?.verbose) {
        args.push('-v');
    }

    if (opts?.depth) {
        args.push('--depth', opts.depth);
    }

    if (opts?.showRevs) {
        args.push('--show-revs', opts.showRevs);
    }

    if (opts?.log) {
        args.push('--log');
    }

    if (opts?.incremental) {
        args.push('--incremental');
    }

    args.push(source);

    if (target) {
        args.push(target);
    }

    const result = await client.exec('mergeinfo', args);
    return result.stdout;
}
