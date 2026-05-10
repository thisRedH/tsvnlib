import type { SvnClient } from '../client.js';
import type { AcceptAction, Depth } from '../types.js';

type ResolvableAccept = Exclude<AcceptAction, 'edit' | 'launch' | 'recommended' | 'e' | 'l' | 'r'>;

export interface ResolveOptions {
    targets?: string;
    recursive?: boolean;
    depth?: Depth;
    quiet?: boolean;
    accept?: ResolvableAccept;
}

export async function resolve(
    client: SvnClient,
    paths?: string[],
    opts?: ResolveOptions,
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

    if (opts?.accept) {
        args.push('--accept', opts.accept);
    }

    if (paths) {
        args.push(...paths);
    }

    await client.exec('resolve', args);
}
