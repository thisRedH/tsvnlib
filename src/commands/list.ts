import type { SvnClient } from '../client.js';
import type { RevisionArg, Depth } from '../types.js';
import { serializeRevisionArg } from '../args.js';
import { parseListXml } from '../parse/list.js';
import type { ListEntry } from '../parse/list.js';

export type { ListEntry };

export interface ListOptions {
    revision?: RevisionArg;
    verbose?: boolean;
    recursive?: boolean;
    humanReadable?: boolean;
    depth?: Depth;
    incremental?: boolean;
    includeExternals?: boolean;
    search?: string;
}

export async function list(
    client: SvnClient,
    targets?: string[],
    opts?: ListOptions,
): Promise<Map<string, ListEntry[]>> {
    const args: string[] = ['--xml'];

    if (opts?.revision !== undefined) {
        args.push('-r', serializeRevisionArg(opts.revision));
    }

    if (opts?.verbose) {
        args.push('-v');
    }

    if (opts?.recursive) {
        args.push('-R');
    }

    if (opts?.humanReadable) {
        args.push('--human-readable');
    }

    if (opts?.depth) {
        args.push('--depth', opts.depth);
    }

    if (opts?.incremental) {
        args.push('--incremental');
    }

    if (opts?.includeExternals) {
        args.push('--include-externals');
    }

    if (opts?.search) {
        args.push('--search', opts.search);
    }

    if (targets) {
        args.push(...targets);
    }

    const result = await client.exec('list', args);
    return parseListXml(result.stdout);
}
