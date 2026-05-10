import type { SvnClient } from '../client.js';

export interface UpgradeOptions {
    quiet?: boolean;
    compatibleVersion?: string;
}

export async function upgrade(
    client: SvnClient,
    paths?: string[],
    opts?: UpgradeOptions,
): Promise<void> {
    const args: string[] = [];

    if (opts?.quiet) {
        args.push('-q');
    }

    if (opts?.compatibleVersion) {
        args.push('--compatible-version', opts.compatibleVersion);
    }

    if (paths) {
        args.push(...paths);
    }

    await client.exec('upgrade', args);
}
