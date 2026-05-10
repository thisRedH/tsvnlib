import type { SvnClient } from '../client.js';
import type { RevisionArg, Depth, SetDepth, AcceptAction } from '../types.js';
import { serializeRevisionArg } from '../args.js';
import { parseUpdateRevision } from '../parse/text.js';

export interface UpdateOptions {
    revision?: RevisionArg;
    depth?: Depth;
    setDepth?: SetDepth;
    diff3Cmd?: string;
    force?: boolean;
    ignoreExternals?: boolean;
    changelist?: string | string[];
    editorCmd?: string;
    accept?: AcceptAction;
    parents?: boolean;
    addsAsModification?: boolean;
}

export async function update(
    client: SvnClient,
    paths?: string[],
    opts?: UpdateOptions,
): Promise<{ revision: number }> {
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

    if (opts?.diff3Cmd) {
        args.push('--diff3-cmd', opts.diff3Cmd);
    }

    if (opts?.force) {
        args.push('--force');
    }

    if (opts?.ignoreExternals) {
        args.push('--ignore-externals');
    }

    if (opts?.changelist) {
        const changelists = Array.isArray(opts.changelist) ? opts.changelist : [opts.changelist];
        for (const cl of changelists) {
            args.push('--changelist', cl);
        }
    }

    if (opts?.editorCmd) {
        args.push('--editor-cmd', opts.editorCmd);
    }

    if (opts?.accept) {
        args.push('--accept', opts.accept);
    }

    if (opts?.parents) {
        args.push('--parents');
    }

    if (opts?.addsAsModification) {
        args.push('--adds-as-modification');
    }

    if (paths) {
        args.push(...paths);
    }

    const result = await client.exec('update', args);
    const revision = parseUpdateRevision(result.stdout);
    return { revision };
}
