import type { SvnClient } from '../client.js';
import type { RevisionArg, RevisionRange, Depth } from '../types.js';
import { serializeRevisionArg } from '../args.js';
import { parseXml } from '../parse/xml.js';

export interface DiffSummaryEntry {
    path: string;
    kind: 'file' | 'dir';
    item: 'none' | 'added' | 'modified' | 'deleted';
    props: 'none' | 'modified';
}

export interface DiffOptions {
    revision?: RevisionArg | RevisionRange;
    change?: string;
    old?: string;
    new?: string;
    depth?: Depth;
    diffCmd?: string;
    internalDiff?: boolean;
    extensions?: string;
    noDiffAdded?: boolean;
    noDiffDeleted?: boolean;
    ignoreProperties?: boolean;
    propertiesOnly?: boolean;
    showCopiesAsAdds?: boolean;
    noticeAncestry?: boolean;
    changelist?: string | string[];
    force?: boolean;
    git?: boolean;
    patchCompatible?: boolean;
    output?: string;
    summarize?: boolean;
}

interface RawPath {
    '#text'?: string;
    props?: string;
    kind?: string;
    item?: string;
}

interface RawDiff {
    diff?: { paths?: { path?: RawPath[] } };
}

export async function diff(
    client: SvnClient,
    targets: string[],
    opts: DiffOptions & { summarize: true },
): Promise<DiffSummaryEntry[]>;
export async function diff(
    client: SvnClient,
    targets?: string[],
    opts?: DiffOptions,
): Promise<string>;
export async function diff(
    client: SvnClient,
    targets?: string[],
    opts?: DiffOptions,
): Promise<DiffSummaryEntry[] | string> {
    const args: string[] = [];

    if (opts?.revision !== undefined) {
        args.push('-r', serializeRevisionArg(opts.revision));
    }

    if (opts?.change !== undefined) {
        args.push('--change', opts.change);
    }

    if (opts?.old !== undefined) {
        args.push('--old', opts.old);
    }

    if (opts?.new !== undefined) {
        args.push('--new', opts.new);
    }

    if (opts?.depth) {
        args.push('--depth', opts.depth);
    }

    if (opts?.diffCmd) {
        args.push('--diff-cmd', opts.diffCmd);
    }

    if (opts?.internalDiff) {
        args.push('--internal-diff');
    }

    if (opts?.extensions !== undefined) {
        args.push('-x', opts.extensions);
    }

    if (opts?.noDiffAdded) {
        args.push('--no-diff-added');
    }

    if (opts?.noDiffDeleted) {
        args.push('--no-diff-deleted');
    }

    if (opts?.ignoreProperties) {
        args.push('--ignore-properties');
    }

    if (opts?.propertiesOnly) {
        args.push('--properties-only');
    }

    if (opts?.showCopiesAsAdds) {
        args.push('--show-copies-as-adds');
    }

    if (opts?.noticeAncestry) {
        args.push('--notice-ancestry');
    }

    if (opts?.changelist) {
        const changelists = Array.isArray(opts.changelist) ? opts.changelist : [opts.changelist];
        for (const cl of changelists) {
            args.push('--changelist', cl);
        }
    }

    if (opts?.force) {
        args.push('--force');
    }
    
    if (opts?.git) {
        args.push('--git');
    }

    if (opts?.patchCompatible) {
        args.push('--patch-compatible');
    }

    if (opts?.output) {
        args.push('--output', opts.output);
    }

    if (opts?.summarize) {
        args.push('--summarize', '--xml');

        if (targets) {
            args.push(...targets);
        }

        const result = await client.exec('diff', args);
    
        const parsed = parseXml<RawDiff>(result.stdout);
        const paths = parsed?.diff?.paths?.path ?? [];

        return paths.map((p): DiffSummaryEntry => ({
            path: p['#text'] ?? '',
            kind: (p.kind as 'file' | 'dir') ?? 'file',
            item: (p.item as DiffSummaryEntry['item']) ?? 'none',
            props: (p.props as DiffSummaryEntry['props']) ?? 'none',
        }));
    } else {
        if (targets) {
            args.push(...targets);
        }
    
        const result = await client.exec('diff', args);
        return result.stdout;
    }
}
