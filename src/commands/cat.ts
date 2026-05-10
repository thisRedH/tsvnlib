import type { SvnClient } from '../client.js';
import type { RevisionArg } from '../types.js';
import { serializeRevisionArg } from '../args.js';

export interface CatOptions {
    revision?: RevisionArg;
    ignoreKeywords?: boolean;
    output?: string;
}

export async function cat(
    client: SvnClient,
    targets: string[],
    opts?: CatOptions,
): Promise<Uint8Array> {
    const args: string[] = [];

    if (opts?.revision !== undefined) {
        args.push('-r', serializeRevisionArg(opts.revision));
    }

    if (opts?.ignoreKeywords) {
        args.push('--ignore-keywords');
    }

    if (opts?.output) {
        args.push('--output', opts.output);
    }

    args.push(...targets);

    const result = await client.exec('cat', args, { binary: true });
    return result.stdout;
}
