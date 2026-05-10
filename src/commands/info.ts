import type { SvnClient } from '../client.js';
import type { RevisionArg, Depth } from '../types.js';
import { serializeRevisionArg } from '../args.js';
import { parseInfoXml } from '../parse/info.js';
import type { InfoEntry } from '../parse/info.js';

export type { InfoEntry };
export type { InfoLock, InfoTreeConflict } from '../parse/info.js';

export type InfoShowItem =
    | 'kind'
    | 'url'
    | 'relative-url'
    | 'repos-root-url'
    | 'repos-uuid'
    | 'repos-size'
    | 'revision'
    | 'last-changed-revision'
    | 'last-changed-date'
    | 'last-changed-author'
    | 'wc-root'
    | 'schedule'
    | 'depth'
    | 'changelist';

export interface InfoOptions {
    revision?: RevisionArg;
    recursive?: boolean;
    humanReadable?: boolean;
    depth?: Depth;
    targets?: string;
    incremental?: boolean;
    changelist?: string | string[];
    includeExternals?: boolean;
    showItem?: InfoShowItem;
    noNewline?: boolean;
}

export async function info(
    client: SvnClient,
    targets: string[],
    opts: InfoOptions & { showItem: InfoShowItem },
): Promise<string>;
export async function info(
    client: SvnClient,
    targets?: string[],
    opts?: InfoOptions,
): Promise<InfoEntry[]>;
export async function info(
    client: SvnClient,
    targets?: string[],
    opts?: InfoOptions,
): Promise<InfoEntry[] | string> {
    const args: string[] = [];

    if (opts?.revision !== undefined) {
        args.push('-r', serializeRevisionArg(opts.revision));
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

    if (opts?.targets) {
        args.push('--targets', opts.targets);
    }

    if (opts?.incremental) {
        args.push('--incremental');
    }

    if (opts?.changelist) {
        const changelists = Array.isArray(opts.changelist) ? opts.changelist : [opts.changelist];
        for (const cl of changelists) {
            args.push('--changelist', cl);
        }
    }

    if (opts?.includeExternals) {
        args.push('--include-externals');
    }

    if (opts?.showItem) {
        args.push('--show-item', opts.showItem);

        if (opts?.noNewline) {
            args.push('--no-newline');
        }

        if (targets) {
            args.push(...targets);
        }

        const result = await client.exec('info', args);
        return result.stdout;
    } else {
        args.push('--xml');

        if (targets) {
            args.push(...targets);
        }

        const result = await client.exec('info', args);
        return parseInfoXml(result.stdout);
    }
}
