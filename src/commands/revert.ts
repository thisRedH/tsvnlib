import type { SvnClient } from '../client.js';
import type { Depth } from '../types.js';

export interface RevertOptions {
    targets?: string;
    recursive?: boolean;
    depth?: Depth;
    quiet?: boolean;
    changelist?: string | string[];
    removeAdded?: boolean;
}

export async function revert(
    client: SvnClient,
    paths: string[],
    opts?: RevertOptions
): Promise<void> {
    const args: string[] = [];

    if (opts?.targets) {
        args.push('--targets', opts.targets);
    }

    if (opts?.recursive) {
        args.push('-R');
    }

    if (opts?.depth) {
        args.push('--depth', opts.depth);
    }

    if (opts?.quiet) {
        args.push('-q');
    }

    if (opts?.changelist) {
        const changelists = Array.isArray(opts.changelist) ? opts.changelist : [opts.changelist];
        for (const cl of changelists) {
            args.push('--changelist', cl);
        }
    }

    if (opts?.removeAdded) {
        args.push('--remove-added');
    }

    args.push(...paths);

    await client.exec('revert', args);
}
