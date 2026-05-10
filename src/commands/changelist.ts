import type { SvnClient } from '../client.js';
import type { Depth } from '../types.js';

export interface ChangelistOptions {
    remove?: boolean;
    quiet?: boolean;
    recursive?: boolean;
    depth?: Depth;
    targets?: string;
    changelist?: string;
}

export async function changelist(
    client: SvnClient,
    clname: string | null,
    paths: string[],
    opts?: ChangelistOptions,
): Promise<void> {
    const args: string[] = [];

    const removing = clname === null || opts?.remove === true;

    if (removing) {
        args.push('--remove');
    }

    if (opts?.quiet) {
        args.push('-q');
    }

    if (opts?.recursive) {
        args.push('-R');
    }

    if (opts?.depth) {
        args.push('--depth', opts.depth);
    }

    if (opts?.targets) {
        args.push('--targets', opts.targets);
    }

    if (opts?.changelist) {
        args.push('--changelist', opts.changelist);
    }

    if (!removing) {
        args.push(clname as string);
    }

    args.push(...paths);

    await client.exec('changelist', args);
}
