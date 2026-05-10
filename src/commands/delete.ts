import type { SvnClient } from '../client.js';

export interface DeleteOptions {
    force?: boolean;
    quiet?: boolean;
    targets?: string;
    message?: string;
    file?: string;
    forceLog?: boolean;
    editorCmd?: string;
    encoding?: string;
    withRevprop?: string;
    keepLocal?: boolean;
}

export async function delete_(
    client: SvnClient,
    targets: string[],
    opts?: DeleteOptions,
): Promise<void> {
    const args: string[] = [];

    if (opts?.force) {
        args.push('--force');
    }

    if (opts?.quiet) {
        args.push('-q');
    }

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

    if (opts?.editorCmd) {
        args.push('--editor-cmd', opts.editorCmd);
    }

    if (opts?.encoding) {
        args.push('--encoding', opts.encoding);
    }

    if (opts?.withRevprop) {
        args.push('--with-revprop', opts.withRevprop);
    }

    if (opts?.keepLocal) {
        args.push('--keep-local');
    }

    args.push(...targets);

    await client.exec('delete', args);
}
