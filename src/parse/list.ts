import { parseXml } from './xml.js';

export interface ListEntry {
    name: string;
    kind: 'file' | 'dir';
    size?: number;
    lastChangedRev: number;
    lastChangedAuthor?: string;
    lastChangedDate?: string;
    locked?: boolean;
}

interface RawCommit {
    revision?: number;
    author?: string;
    date?: string;
}

interface RawLock {
    token?: string;
    owner?: string;
    comment?: string;
    created?: string;
    expires?: string;
}

interface RawEntry {
    kind?: string;
    name?: string;
    size?: number;
    commit?: RawCommit;
    lock?: RawLock;
}

interface RawList {
    path?: string;
    entry?: RawEntry[];
}

interface RawLists {
    lists?: {
        list?: RawList[];
    };
}

export function parseListXml(xml: string): Map<string, ListEntry[]> {
    const parsed = parseXml<RawLists>(xml);
    const lists = parsed?.lists?.list ?? [];
    const result = new Map<string, ListEntry[]>();

    for (const list of lists) {
        const key = list.path ?? '';
        const entries: ListEntry[] = (list.entry ?? []).map((e) => ({
            name: e.name ?? '',
            kind: (e.kind as 'file' | 'dir') ?? 'file',
            size: e.size,
            lastChangedRev: e.commit?.revision ?? 0,
            lastChangedAuthor: e.commit?.author,
            lastChangedDate: e.commit?.date,
            locked: e.lock !== undefined,
        }));
        result.set(key, entries);
    }

    return result;
}
