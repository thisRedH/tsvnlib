import type { SvnClient } from '../client.js';
import type { RevisionArg, Depth, SetDepth, AcceptAction } from '../types.js';
import { serializeRevisionArg } from '../args.js';

export interface SwitchOptions {
    revision?: RevisionArg;
    depth?: Depth;
    setDepth?: SetDepth;
    quiet?: boolean;
    diff3Cmd?: string;
    ignoreExternals?: boolean;
    ignoreAncestry?: boolean;
    force?: boolean;
    accept?: AcceptAction;
}

export async function switch_(
    client: SvnClient,
    url: string,
    path?: string,
    opts?: SwitchOptions,
): Promise<void> {
    const args: string[] = [];

    if (opts?.revision !== undefined) {
        args.push('-r', serializeRevisionArg(opts.revision));
    }

    if (opts?.depth) {
        args.push('--depth', opts.depth);
    }

    if (opts?.setDepth) {
        args.push('--set-depth', opts.setDepth);
    }

    if (opts?.quiet) {
        args.push('-q');
    }

    if (opts?.diff3Cmd) {
        args.push('--diff3-cmd', opts.diff3Cmd);
    }

    if (opts?.ignoreExternals) {
        args.push('--ignore-externals');
    }

    if (opts?.ignoreAncestry) {
        args.push('--ignore-ancestry');
    }

    if (opts?.force) {
        args.push('--force');
    }

    if (opts?.accept) {
        args.push('--accept', opts.accept);
    }

    args.push(url);

    if (path) {
        args.push(path);
    }

    await client.exec('switch', args);
}
