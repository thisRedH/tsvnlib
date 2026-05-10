import type { SvnClient } from '../client.js';
import type { RevisionArg, Depth } from '../types.js';
import { serializeRevisionArg } from '../args.js';
import { parseProplistXml, parsePropgetXml } from '../parse/props.js';
import type { PropEntry } from '../parse/props.js';

export type { PropEntry };

// ---- propdel ----

export interface PropddelOptions {
    quiet?: boolean;
    recursive?: boolean;
    depth?: Depth;
    revision?: RevisionArg;
    revprop?: boolean;
    changelist?: string | string[];
}

export async function propdel(
    client: SvnClient,
    propname: string,
    targets?: string[],
    opts?: PropddelOptions,
): Promise<void> {
    const args: string[] = [];

    if (opts?.quiet) {
        args.push('-q');
    }

    if (opts?.recursive) {
        args.push('-R');
    }

    if (opts?.depth) {
        args.push('--depth', opts.depth);
    }

    if (opts?.revision !== undefined) {
        args.push('-r', serializeRevisionArg(opts.revision));
    }

    if (opts?.revprop) {
        args.push('--revprop');
    }

    if (opts?.changelist) {
        const changelists = Array.isArray(opts.changelist) ? opts.changelist : [opts.changelist];
        for (const cl of changelists) {
            args.push('--changelist', cl);
        }
    }

    args.push(propname);

    if (targets) {
        args.push(...targets);
    }

    await client.exec('propdel', args);
}

// ---- propedit ----

export interface PropeditOptions {
    revision?: RevisionArg;
    revprop?: boolean;
    message?: string;
    file?: string;
    forceLog?: boolean;
    editorCmd?: string;
    encoding?: string;
    withRevprop?: string;
    force?: boolean;
}

export async function propedit(
    client: SvnClient,
    propname: string,
    targets: string[],
    opts?: PropeditOptions,
): Promise<void> {
    const args: string[] = [];

    if (opts?.revision !== undefined) {
        args.push('-r', serializeRevisionArg(opts.revision));
    }

    if (opts?.revprop) {
        args.push('--revprop');
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

    if (opts?.force) {
        args.push('--force');
    }

    args.push(propname, ...targets);

    await client.exec('propedit', args);
}

// ---- propget ----

export interface PropgetOptions {
    verbose?: boolean;
    recursive?: boolean;
    depth?: Depth;
    revision?: RevisionArg;
    revprop?: boolean;
    noNewline?: boolean;
    changelist?: string | string[];
    showInheritedProps?: boolean;
}

export async function propget(
    client: SvnClient,
    propname: string,
    targets?: string[],
    opts?: PropgetOptions,
): Promise<string> {
    const args: string[] = [];

    if (opts?.verbose) {
        args.push('-v');
    }

    if (opts?.recursive) {
        args.push('-R');
    }

    if (opts?.depth) {
        args.push('--depth', opts.depth);
    }

    if (opts?.revision !== undefined) {
        args.push('-r', serializeRevisionArg(opts.revision));
    }

    if (opts?.revprop) {
        args.push('--revprop');
    }

    if (opts?.noNewline) {
        args.push('--no-newline');
    }

    if (opts?.changelist) {
        const changelists = Array.isArray(opts.changelist) ? opts.changelist : [opts.changelist];
        for (const cl of changelists) {
            args.push('--changelist', cl);
        }
    }

    if (opts?.showInheritedProps) {
        args.push('--show-inherited-props');
    }

    if (opts?.revprop) {  // --revprop cannot use --xml
        args.push(propname);

        if (targets) {
            args.push(...targets);
        }

        const result = await client.exec('propget', args);
        return result.stdout;
    } else {
        args.push('--xml', propname);

        if (targets) {
            args.push(...targets);
        }

        const result = await client.exec('propget', args);
        return parsePropgetXml(result.stdout);
    }

}

// ---- proplist ----

export interface ProplistOptions {
    verbose?: boolean;
    recursive?: boolean;
    depth?: Depth;
    revision?: RevisionArg;
    quiet?: boolean;
    revprop?: boolean;
    changelist?: string | string[];
    showInheritedProps?: boolean;
}

export async function proplist(
    client: SvnClient,
    targets?: string[],
    opts?: ProplistOptions,
): Promise<Map<string, PropEntry[]>> {
    const args: string[] = ['--xml'];

    if (opts?.verbose) {
        args.push('-v');
    }

    if (opts?.recursive) {
        args.push('-R');
    }

    if (opts?.depth) {
        args.push('--depth', opts.depth);
    }

    if (opts?.revision !== undefined) {
        args.push('-r', serializeRevisionArg(opts.revision));
    }

    if (opts?.quiet) {
        args.push('-q');
    }

    if (opts?.revprop) {
        args.push('--revprop');
    }

    if (opts?.changelist) {
        const changelists = Array.isArray(opts.changelist) ? opts.changelist : [opts.changelist];
        for (const cl of changelists) {
            args.push('--changelist', cl);
        }
    }

    if (opts?.showInheritedProps) {
        args.push('--show-inherited-props');
    }

    if (targets) {
        args.push(...targets);
    }

    const result = await client.exec('proplist', args);
    return parseProplistXml(result.stdout);
}

// ---- propset ----

export interface PropsetOptions {
    file?: string;
    encoding?: string;
    quiet?: boolean;
    revision?: RevisionArg;
    targets?: string;
    recursive?: boolean;
    depth?: Depth;
    revprop?: boolean;
    force?: boolean;
    changelist?: string | string[];
}

export async function propset(
    client: SvnClient,
    propname: string,
    value: string,
    targets: string[],
    opts?: PropsetOptions,
): Promise<void> {
    const args: string[] = [];

    if (opts?.file !== undefined) {
        args.push('-F', opts.file);
    }

    if (opts?.encoding) {
        args.push('--encoding', opts.encoding);
    }

    if (opts?.quiet) {
        args.push('-q');
    }

    if (opts?.revision !== undefined) {
        args.push('-r', serializeRevisionArg(opts.revision));
    }

    if (opts?.targets) {
        args.push('--targets', opts.targets);
    }

    if (opts?.recursive) {
        args.push('-R');
    }

    if (opts?.depth) {
        args.push('--depth', opts.depth);
    }

    if (opts?.revprop) {
        args.push('--revprop');
    }

    if (opts?.force) {
        args.push('--force');
    }

    if (opts?.changelist) {
        const changelists = Array.isArray(opts.changelist) ? opts.changelist : [opts.changelist];
        for (const cl of changelists) {
            args.push('--changelist', cl);
        }
    }

    args.push(propname, value, ...targets);

    await client.exec('propset', args);
}
