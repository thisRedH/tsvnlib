import type { SvnClient } from '../client.js';
import type { RevisionArg, Depth } from '../types.js';
import { serializeRevisionArg } from '../args.js';

export interface CheckoutOptions {
    revision?: RevisionArg;
    quiet?: boolean;
    depth?: Depth;
    force?: boolean;
    ignoreExternals?: boolean;
    compatibleVersion?: string;
}

export async function checkout(
    client: SvnClient,
    urls: string[],
    path?: string,
    opts?: CheckoutOptions,
): Promise<void> {
    const args: string[] = [];

    if (opts?.revision !== undefined) {
        args.push('-r', serializeRevisionArg(opts.revision));
    }

    if (opts?.quiet) {
        args.push('-q');
    }

    if (opts?.depth) {
        args.push('--depth', opts.depth);
    }

    if (opts?.force) {
        args.push('--force');
    }

    if (opts?.ignoreExternals) {
        args.push('--ignore-externals');
    }

    if (opts?.compatibleVersion) {
        args.push('--compatible-version', opts.compatibleVersion);
    }

    args.push(...urls);

    if (path) {
        args.push(path);
    }

    await client.exec('checkout', args);
}
