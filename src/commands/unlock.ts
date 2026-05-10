import type { SvnClient } from '../client.js';

export interface UnlockOptions {
    targets?: string;
    force?: boolean;
    quiet?: boolean;
}

export async function unlock(
    client: SvnClient,
    targets: string[],
    opts?: UnlockOptions,
): Promise<void> {
    const args: string[] = [];

    if (opts?.targets) {
        args.push('--targets', opts.targets);
    }

    if (opts?.force) {
        args.push('--force');
    }

    if (opts?.quiet) {
        args.push('-q');
    }

    args.push(...targets);

    await client.exec('unlock', args);
}
