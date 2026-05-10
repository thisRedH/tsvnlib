import type { SvnClient } from '../client.js';

export interface CleanupOptions {
    removeUnversioned?: boolean;
    removeIgnored?: boolean;
    vacuumPristines?: boolean;
    includeExternals?: boolean;
    quiet?: boolean;
}

export async function cleanup(
    client: SvnClient,
    paths?: string[],
    opts?: CleanupOptions,
): Promise<void> {
    const args: string[] = [];

    if (opts?.removeUnversioned) {
        args.push('--remove-unversioned');
    }

    if (opts?.removeIgnored) {
        args.push('--remove-ignored');
    }

    if (opts?.vacuumPristines) {
        args.push('--vacuum-pristines');
    }

    if (opts?.includeExternals) {
        args.push('--include-externals');
    }

    if (opts?.quiet) {
        args.push('-q');
    }

    if (paths) {
        args.push(...paths);
    }

    await client.exec('cleanup', args);
}
