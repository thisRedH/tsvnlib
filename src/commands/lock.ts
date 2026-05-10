import type { SvnClient } from '../client.js';

export interface LockOptions {
    targets?: string;
    message?: string;
    file?: string;
    forceLog?: boolean;
    encoding?: string;
    force?: boolean;
    quiet?: boolean;
}

export async function lock(
    client: SvnClient,
    targets: string[],
    opts?: LockOptions,
): Promise<void> {
    const args: string[] = [];

    if (opts?.targets) {
        args.push('--targets', opts.targets);
    }

    if (opts?.message !== undefined) {
        args.push('-m', opts.message);
    }

    if (opts?.file !== undefined) {
        args.push('-F', opts.file);
    }

    if (opts?.forceLog) {
        args.push('--force-log');
    }

    if (opts?.encoding) {
        args.push('--encoding', opts.encoding);
    }

    if (opts?.force) {
        args.push('--force');
    }

    if (opts?.quiet) {
        args.push('-q');
    }

    args.push(...targets);

    await client.exec('lock', args);
}
