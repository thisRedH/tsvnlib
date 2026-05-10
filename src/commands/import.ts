import type { SvnClient } from '../client.js';
import type { Depth } from '../types.js';
import { parseCommitRevision } from '../parse/text.js';

export interface ImportOptions {
    depth?: Depth;
    autoProps?: boolean;
    noAutoProps?: boolean;
    force?: boolean;
    message?: string;
    file?: string;
    forceLog?: boolean;
    editorCmd?: string;
    encoding?: string;
    withRevprop?: string;
    noIgnore?: boolean;
}

export async function import_(
    client: SvnClient,
    path: string,
    url: string,
    opts?: ImportOptions,
): Promise<{ revision: number }> {
    const args: string[] = [];

    if (opts?.depth) {
        args.push('--depth', opts.depth);
    }

    if (opts?.autoProps) {
        args.push('--auto-props');
    }

    if (opts?.noAutoProps) {
        args.push('--no-auto-props');
    }

    if (opts?.force) {
        args.push('--force');
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

    if (opts?.editorCmd) {
        args.push('--editor-cmd', opts.editorCmd);
    }

    if (opts?.encoding) {
        args.push('--encoding', opts.encoding);
    }

    if (opts?.withRevprop) {
        args.push('--with-revprop', opts.withRevprop);
    }

    if (opts?.noIgnore) {
        args.push('--no-ignore');
    }

    args.push(path, url);

    const result = await client.exec('import', args);
    const revision = parseCommitRevision(result.stdout);
    return { revision };
}
