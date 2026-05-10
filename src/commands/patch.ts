import type { SvnClient } from '../client.js';

export interface PatchOptions {
    quiet?: boolean;
    dryRun?: boolean;
    strip?: number;
    reverseDiff?: boolean;
    ignoreWhitespace?: boolean;
}

export async function patch(
    client: SvnClient,
    patchFile: string,
    wcPath?: string,
    opts?: PatchOptions,
): Promise<void> {
    const args: string[] = [];

    if (opts?.quiet) {
        args.push('-q');
    }

    if (opts?.dryRun) {
        args.push('--dry-run');
    }

    if (opts?.strip !== undefined) {
        args.push('--strip', String(opts.strip));
    }

    if (opts?.reverseDiff) {
        args.push('--reverse-diff');
    }

    if (opts?.ignoreWhitespace) {
        args.push('--ignore-whitespace');
    }

    args.push(patchFile);

    if (wcPath) {
        args.push(wcPath);
    }

    await client.exec('patch', args);
}
