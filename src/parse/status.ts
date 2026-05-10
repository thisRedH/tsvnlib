import { resolve } from 'node:path';
import { parseXml, parseBool } from './xml.js';

export type WcItemStatus =
    | 'added'
    | 'conflicted'
    | 'deleted'
    | 'external'
    | 'ignored'
    | 'incomplete'
    | 'merged'
    | 'missing'
    | 'modified'
    | 'none'
    | 'normal'
    | 'obstructed'
    | 'replaced'
    | 'unversioned';

export type WcPropsStatus = 'conflicted' | 'modified' | 'normal' | 'none';

export interface StatusEntry {
    path: string;
    absolutePath?: string;
    item: WcItemStatus;
    props: WcPropsStatus;
    revision?: number;
    wcLocked: boolean;
    copied: boolean;
    switched: boolean;
    treeConflicted: boolean;
    movedFrom?: string;
    movedTo?: string;
    lastCommitRev?: number;
    lastCommitDate?: string;
    lastCommitAuthor?: string;
    locked?: boolean;
    lockToken?: string;
    lockOwner?: string;
    reposItem?: 'added' | 'deleted' | 'modified' | 'replaced' | 'none';
    reposProps?: 'modified' | 'none';
    reposLocked?: boolean;
    againstRevision?: number;
    changelist?: string;
}

interface RawLock {
    token?: string;
    owner?: string;
    comment?: string;
    created?: string;
}

interface RawCommit {
    revision?: number;
    author?: string;
    date?: string;
}

interface RawWcStatus {
    item?: string;
    props?: string;
    revision?: number;
    'wc-locked'?: boolean | string;
    copied?: boolean | string;
    switched?: boolean | string;
    'tree-conflicted'?: boolean | string;
    'moved-from'?: string;
    'moved-to'?: string;
    commit?: RawCommit;
    lock?: RawLock;
}

interface RawReposStatus {
    item?: string;
    props?: string;
    lock?: RawLock;
}

interface RawEntry {
    path?: string;
    'wc-status'?: RawWcStatus;
    'repos-status'?: RawReposStatus;
}

interface RawAgainst {
    revision?: number;
}

interface RawTarget {
    path?: string;
    entry?: RawEntry[];
    against?: RawAgainst;
}

interface RawChangelist {
    name?: string;
    entry?: RawEntry[];
    against?: RawAgainst;
}

interface RawStatus {
    status?: {
        target?: RawTarget[];
        changelist?: RawChangelist[];
    };
}

function parseEntry(e: RawEntry, againstRevision?: number, changelist?: string, targetAbsPath?: string): StatusEntry {
    const wc = e['wc-status'];
    const repos = e['repos-status'];

    return {
        path: e.path ?? '',
        absolutePath: targetAbsPath !== undefined && e.path !== undefined
            ? resolve(targetAbsPath, e.path)
            : undefined,
        item: (wc?.item as WcItemStatus) ?? 'none',
        props: (wc?.props as WcPropsStatus) ?? 'none',
        revision: wc?.revision,
        wcLocked: parseBool(wc?.['wc-locked']),
        copied: parseBool(wc?.copied),
        switched: parseBool(wc?.switched),
        treeConflicted: parseBool(wc?.['tree-conflicted']),
        movedFrom: wc?.['moved-from'],
        movedTo: wc?.['moved-to'],
        lastCommitRev: wc?.commit?.revision,
        lastCommitDate: wc?.commit?.date,
        lastCommitAuthor: wc?.commit?.author,
        locked: wc?.lock !== undefined,
        lockToken: wc?.lock?.token,
        lockOwner: wc?.lock?.owner,
        reposItem: repos?.item as StatusEntry['reposItem'],
        reposProps: repos?.props as StatusEntry['reposProps'],
        reposLocked: repos?.lock !== undefined ? true : undefined,
        againstRevision,
        changelist,
    };
}

export function parseStatusXml(xml: string, cwd?: string): StatusEntry[] {
    const parsed = parseXml<RawStatus>(xml);
    const statusRoot = parsed?.status;

    const results: StatusEntry[] = [];

    const targets = statusRoot?.target ?? [];
    for (const target of targets) {
        const targetAbsPath = cwd !== undefined && target.path !== undefined
            ? resolve(cwd, target.path)
            : undefined;
        const againstRevision = target.against?.revision;
        for (const entry of target.entry ?? []) {
            results.push(parseEntry(entry, againstRevision, undefined, targetAbsPath));
        }
    }

    const changelists = statusRoot?.changelist ?? [];
    for (const cl of changelists) {
        const againstRevision = cl.against?.revision;
        for (const entry of cl.entry ?? []) {
            results.push(parseEntry(entry, againstRevision, cl.name, cwd));
        }
    }

    return results;
}
