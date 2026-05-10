import type { SvnClient } from '../client.js';
import type { RevisionArg } from '../types.js';
import { serializeRevisionArg } from '../args.js';

export interface CopyOptions {
    revision?: RevisionArg;
    quiet?: boolean;
    ignoreExternals?: boolean;
    parents?: boolean;
    message?: string;
    file?: string;
    forceLog?: boolean;
    editorCmd?: string;
    encoding?: string;
    withRevprop?: string;
    pinExternals?: boolean;
}

export async function copy(
    client: SvnClient,
    srcs: string[],
    dst: string,
    opts?: CopyOptions,
): Promise<void> {
    const args: string[] = [];

    if (opts?.revision !== undefined) {
        args.push('-r', serializeRevisionArg(opts.revision));
    }

    if (opts?.quiet) {
        args.push('-q');
    }

    if (opts?.ignoreExternals) {
        args.push('--ignore-externals');
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

    if (opts?.pinExternals) {
        args.push('--pin-externals');
    }

    args.push(...srcs, dst);

    await client.exec('copy', args);
}
