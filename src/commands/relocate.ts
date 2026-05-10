import type { SvnClient } from '../client.js';

export interface RelocateOptions {
    ignoreExternals?: boolean;
}

export async function relocate(
    client: SvnClient,
    fromPrefixOrToUrl: string,
    toPrefixOrPath?: string,
    paths?: string[],
    opts?: RelocateOptions,
): Promise<void> {
    const args: string[] = [];

    if (opts?.ignoreExternals) {
        args.push('--ignore-externals');
    }

    args.push(fromPrefixOrToUrl);

    if (toPrefixOrPath !== undefined) {
        args.push(toPrefixOrPath);
    }

    if (paths) {
        args.push(...paths);
    }

    await client.exec('relocate', args);
}
