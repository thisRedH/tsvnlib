import type { SvnClient } from '../client.js';
import type { RevisionArg, Depth } from '../types.js';
import { serializeRevisionArg } from '../args.js';

export interface ExportOptions {
    revision?: RevisionArg;
    quiet?: boolean;
    depth?: Depth;
    force?: boolean;
    nativeEol?: 'LF' | 'CR' | 'CRLF';
    ignoreExternals?: boolean;
    ignoreKeywords?: boolean;
}

export async function export_(
    client: SvnClient,
    src: string,
    dst?: string,
    opts?: ExportOptions,
): Promise<void> {
    const args: string[] = [];

    if (opts?.revision !== undefined) {
        args.push('-r', serializeRevisionArg(opts.revision));
    }

    if (opts?.quiet) {
        args.push('-q');
    }

    if (opts?.depth) {
        args.push('--depth', opts.depth);
    }

    if (opts?.force) {
        args.push('--force');
    }

    if (opts?.nativeEol) {
        args.push('--native-eol', opts.nativeEol);
    }

    if (opts?.ignoreExternals) {
        args.push('--ignore-externals');
    }

    if (opts?.ignoreKeywords) {
        args.push('--ignore-keywords');
    }

    args.push(src);

    if (dst) {
        args.push(dst);
    }

    await client.exec('export', args);
}
