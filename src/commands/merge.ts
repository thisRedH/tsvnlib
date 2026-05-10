import type { SvnClient } from '../client.js';
import type { RevisionArg, RevisionRange, Depth, AcceptAction } from '../types.js';
import { serializeRevisionArg } from '../args.js';

export interface MergeOptions {
    revision?: RevisionArg | RevisionRange;
    change?: string;
    depth?: Depth;
    quiet?: boolean;
    force?: boolean;
    dryRun?: boolean;
    diff3Cmd?: string;
    recordOnly?: boolean;
    extensions?: string;
    ignoreAncestry?: boolean;
    accept?: AcceptAction;
    allowMixedRevisions?: boolean;
    verbose?: boolean;
}

function buildMergeArgs(opts?: MergeOptions): string[] {
    const args: string[] = [];

    if (opts?.revision !== undefined) {
        args.push('-r', serializeRevisionArg(opts.revision));
    }

    if (opts?.change !== undefined) {
        args.push('--change', opts.change);
    }

    if (opts?.depth) {
        args.push('--depth', opts.depth);
    }

    if (opts?.quiet) {
        args.push('-q');
    }

    if (opts?.force) {
        args.push('--force');
    }

    if (opts?.dryRun) {
        args.push('--dry-run');
    }

    if (opts?.diff3Cmd) {
        args.push('--diff3-cmd', opts.diff3Cmd);
    }

    if (opts?.recordOnly) {
        args.push('--record-only');
    }

    if (opts?.extensions !== undefined) {
        args.push('-x', opts.extensions);
    }

    if (opts?.ignoreAncestry) {
        args.push('--ignore-ancestry');
    }

    if (opts?.accept) {
        args.push('--accept', opts.accept);
    }

    if (opts?.allowMixedRevisions) {
        args.push('--allow-mixed-revisions');
    }

    if (opts?.verbose) {
        args.push('-v');
    }

    return args;
}

export async function merge(
    client: SvnClient,
    source: string,
    targetWcPath?: string,
    opts?: MergeOptions,
): Promise<void> {
    const args = buildMergeArgs(opts);

    args.push(source);

    if (targetWcPath) {
        args.push(targetWcPath);
    }

    await client.exec('merge', args);
}

export async function merge2URL(
    client: SvnClient,
    source1: string,
    source2: string,
    targetWcPath?: string,
    opts?: MergeOptions,
): Promise<void> {
    const args = buildMergeArgs(opts);

    args.push(source1, source2);

    if (targetWcPath) {
        args.push(targetWcPath);
    }

    await client.exec('merge', args);
}
