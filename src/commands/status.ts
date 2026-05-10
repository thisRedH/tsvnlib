import { resolve } from 'node:path';
import type { SvnClient } from '../client.js';
import type { RevisionArg, Depth } from '../types.js';
import { serializeRevisionArg } from '../args.js';
import { parseStatusXml } from '../parse/status.js';
import type { StatusEntry, WcItemStatus, WcPropsStatus } from '../parse/status.js';

export type { StatusEntry, WcItemStatus, WcPropsStatus };

export interface StatusOptions {
    showUpdates?: boolean;
    verbose?: boolean;
    depth?: Depth;
    revision?: RevisionArg;
    quiet?: boolean;
    noIgnore?: boolean;
    incremental?: boolean;
    ignoreExternals?: boolean;
    changelist?: string | string[];
}

export async function status(
    client: SvnClient,
    paths?: string[],
    opts?: StatusOptions,
): Promise<StatusEntry[]> {
    const args: string[] = ['--xml'];

    if (opts?.showUpdates) {
        args.push('--show-updates');
    }

    if (opts?.verbose) {
        args.push('-v');
    }

    if (opts?.depth) {
        args.push('--depth', opts.depth);
    }

    if (opts?.revision !== undefined) {
        args.push('-r', serializeRevisionArg(opts.revision));
    }

    if (opts?.quiet) {
        args.push('-q');
    }

    if (opts?.noIgnore) {
        args.push('--no-ignore');
    }

    if (opts?.incremental) {
        args.push('--incremental');
    }

    if (opts?.ignoreExternals) {
        args.push('--ignore-externals');
    }

    if (opts?.changelist) {
        const changelists = Array.isArray(opts.changelist) ? opts.changelist : [opts.changelist];
        for (const cl of changelists) {
            args.push('--changelist', cl);
        }
    }

    if (paths) {
        args.push(...paths);
    }

    const result = await client.exec('status', args);
    return parseStatusXml(result.stdout, resolve(client.cwd ?? process.cwd()));
}
