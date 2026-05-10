import type { SvnClient } from '../client.js';
import type { Depth } from '../types.js';

export interface AddOptions {
    targets?: string;
    depth?: Depth;
    quiet?: boolean;
    force?: boolean;
    noIgnore?: boolean;
    autoProps?: boolean;
    noAutoProps?: boolean;
    parents?: boolean;
}

export async function add(
    client: SvnClient,
    paths: string[],
    opts?: AddOptions,
): Promise<void> {
    const args: string[] = [];

    if (opts?.targets) {
        args.push('--targets', opts.targets);
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

    if (opts?.noIgnore) {
        args.push('--no-ignore');
    }

    if (opts?.autoProps) {
        args.push('--auto-props');
    }

    if (opts?.noAutoProps) {
        args.push('--no-auto-props');
    }

    if (opts?.parents) {
        args.push('--parents');
    }

    args.push(...paths);

    await client.exec('add', args);
}
