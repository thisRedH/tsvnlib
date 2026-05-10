import { resolve } from 'node:path';
import { parseXml } from './xml.js';
import type { Depth } from '../types.js';

export interface InfoLock {
    token: string;
    owner: string;
    comment?: string;
    created: string;
    expires?: string;
}

export interface InfoTreeConflict {
    victim: string;
    kind: 'file' | 'dir';
    operation: 'update' | 'merge' | 'switch';
    action: 'edit' | 'add' | 'delete' | 'replace';
    reason:
        | 'edit'
        | 'obstruction'
        | 'delete'
        | 'add'
        | 'missing'
        | 'unversioned'
        | 'replace'
        | 'moved-away'
        | 'moved-here';
}

export interface InfoEntry {
    path: string;
    absolutePath?: string;
    kind: 'file' | 'dir';
    revision: number;
    url?: string;
    relativeUrl?: string;
    reposRootUrl?: string;
    reposUuid?: string;
    lastChangedRev?: number;
    lastChangedDate?: string;
    lastChangedAuthor?: string;
    wcRoot?: string;
    wcCompatibleVersion?: string;
    wcFormat?: number;
    storePristine?: 'yes' | 'no';
    schedule?: 'normal' | 'add' | 'delete' | 'replace' | 'none';
    changelist?: string;
    copyFromUrl?: string;
    copyFromRev?: number;
    depth?: Depth;
    textUpdated?: string;
    propUpdated?: string;
    checksum?: string;
    movedFrom?: string;
    movedTo?: string;
    lock?: InfoLock;
    treeConflict?: InfoTreeConflict;
}

interface RawLock {
    token?: string;
    owner?: string;
    comment?: string;
    created?: string;
    expires?: string;
}

interface RawCommit {
    revision?: number;
    author?: string;
    date?: string;
}

interface RawTreeConflict {
    victim?: string;
    kind?: string;
    operation?: string;
    action?: string;
    reason?: string;
}

interface RawWcInfo {
    'wcroot-abspath'?: string;
    'wc-compatible-version'?: string;
    'wc-format'?: number;
    'store-pristine'?: string;
    schedule?: string;
    changelist?: string;
    'copy-from-url'?: string;
    'copy-from-rev'?: number;
    depth?: string;
    'text-updated'?: string;
    'prop-updated'?: string;
    checksum?: string;
    'moved-from'?: string;
    'moved-to'?: string;
}

interface RawEntry {
    path?: string;
    kind?: string;
    revision?: number;
    url?: string;
    'relative-url'?: string;
    repository?: {
        root?: string;
        uuid?: string;
    };
    'wc-info'?: RawWcInfo;
    commit?: RawCommit;
    lock?: RawLock;
    'tree-conflict'?: RawTreeConflict;
}

interface RawInfo {
    info?: { entry?: RawEntry[] };
}

function parseLock(raw: RawLock): InfoLock {
    return {
        token: raw.token ?? '',
        owner: raw.owner ?? '',
        comment: raw.comment,
        created: raw.created ?? '',
        expires: raw.expires,
    };
}

function parseTreeConflict(raw: RawTreeConflict): InfoTreeConflict {
    return {
        victim: raw.victim ?? '',
        kind: (raw.kind as 'file' | 'dir') ?? 'file',
        operation: (raw.operation as InfoTreeConflict['operation']) ?? 'update',
        action: (raw.action as InfoTreeConflict['action']) ?? 'edit',
        reason: (raw.reason as InfoTreeConflict['reason']) ?? 'edit',
    };
}

export function parseInfoXml(xml: string): InfoEntry[] {
    const parsed = parseXml<RawInfo>(xml);
    const entries = parsed?.info?.entry ?? [];

    return entries.map((e): InfoEntry => {
        const wc = e['wc-info'];

        const wcRootAbspath = wc?.['wcroot-abspath'];
        return {
            path: e.path ?? '',
            absolutePath: wcRootAbspath !== undefined && e.path !== undefined
                ? resolve(wcRootAbspath, e.path)
                : undefined,
            kind: (e.kind as 'file' | 'dir') ?? 'file',
            revision: e.revision ?? 0,
            url: e.url,
            relativeUrl: e['relative-url'],
            reposRootUrl: e.repository?.root,
            reposUuid: e.repository?.uuid,
            lastChangedRev: e.commit?.revision,
            lastChangedDate: e.commit?.date,
            lastChangedAuthor: e.commit?.author,
            wcRoot: wc?.['wcroot-abspath'],
            wcCompatibleVersion: wc?.['wc-compatible-version'] !== undefined
                ? String(wc['wc-compatible-version'])
                : undefined,
            wcFormat: wc?.['wc-format'],
            storePristine: wc?.['store-pristine'] as 'yes' | 'no' | undefined,
            schedule: wc?.schedule as InfoEntry['schedule'],
            changelist: wc?.changelist,
            copyFromUrl: wc?.['copy-from-url'],
            copyFromRev: wc?.['copy-from-rev'],
            depth: wc?.depth as Depth | undefined,
            textUpdated: wc?.['text-updated'],
            propUpdated: wc?.['prop-updated'],
            checksum: wc?.checksum,
            movedFrom: wc?.['moved-from'],
            movedTo: wc?.['moved-to'],
            lock: e.lock
                ? parseLock(e.lock)
                : undefined,
            treeConflict: e['tree-conflict']
                ? parseTreeConflict(e['tree-conflict'])
                : undefined,
        };
    });
}
