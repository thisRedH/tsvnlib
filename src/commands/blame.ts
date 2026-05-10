import type { SvnClient } from '../client.js';
import type { RevisionArg, RevisionRange } from '../types.js';
import { serializeRevisionArg } from '../args.js';
import { parseBlameXml } from '../parse/blame.js';
import type { BlameEntry } from '../parse/blame.js';

export type { BlameEntry };

export interface BlameOptions {
    revision?: RevisionArg | RevisionRange;
    verbose?: boolean;
    useMergeHistory?: boolean;
    incremental?: boolean;
    extensions?: string;
    force?: boolean;
}

export async function blame(
    client: SvnClient,
    targets: string[],
    opts?: BlameOptions,
): Promise<BlameEntry[]> {
    const args: string[] = ['--xml'];

    if (opts?.revision !== undefined) {
        args.push('-r', serializeRevisionArg(opts.revision));
    }

    if (opts?.verbose) {
        args.push('-v');
    }

    if (opts?.useMergeHistory) {
        args.push('--use-merge-history');
    }

    if (opts?.incremental) {
        args.push('--incremental');
    }

    if (opts?.extensions !== undefined) {
        args.push('-x', opts.extensions);
    }

    if (opts?.force) {
        args.push('--force');
    }

    args.push(...targets);

    const result = await client.exec('blame', args);
    return parseBlameXml(result.stdout);
}
