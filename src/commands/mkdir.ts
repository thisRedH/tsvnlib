import type { SvnClient } from '../client.js';

export interface MkdirOptions {
    quiet?: boolean;
    parents?: boolean;
    message?: string;
    file?: string;
    forceLog?: boolean;
    editorCmd?: string;
    encoding?: string;
    withRevprop?: string;
}

export async function mkdir(
    client: SvnClient,
    targets: string[],
    opts?: MkdirOptions,
): Promise<void> {
    const args: string[] = [];

    if (opts?.quiet) {
        args.push('-q');
    }

    if (opts?.parents) {
        args.push('--parents');
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

    args.push(...targets);

    await client.exec('mkdir', args);
}
