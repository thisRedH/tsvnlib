import type { SvnClient } from '../client.js';

export interface MoveOptions {
    quiet?: boolean;
    force?: boolean;
    parents?: boolean;
    allowMixedRevisions?: boolean;
    message?: string;
    file?: string;
    forceLog?: boolean;
    editorCmd?: string;
    encoding?: string;
    withRevprop?: string;
}

export async function move(
    client: SvnClient,
    srcs: string[],
    dst: string,
    opts?: MoveOptions,
): Promise<void> {
    const args: string[] = [];

    if (opts?.quiet) {
        args.push('-q');
    }

    if (opts?.force) {
        args.push('--force');
    }

    if (opts?.parents) {
        args.push('--parents');
    }

    if (opts?.allowMixedRevisions) {
        args.push('--allow-mixed-revisions');
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

    args.push(...srcs, dst);

    await client.exec('move', args);
}
