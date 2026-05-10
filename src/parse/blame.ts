import { parseXml } from './xml.js';

export interface BlameEntry {
    lineNumber: number;
    revision?: number;
    author?: string;
    date?: string;
    mergedPath?: string;
    mergedRevision?: number;
    mergedAuthor?: string;
    mergedDate?: string;
}

interface RawCommit {
    revision?: number;
    author?: string;
    date?: string;
}

interface RawMerged {
    path?: string;
    commit?: RawCommit;
}

interface RawEntry {
    'line-number'?: number;
    commit?: RawCommit;
    merged?: RawMerged;
}

interface RawTarget {
    path?: string;
    entry?: RawEntry[];
}

interface RawBlame {
    blame?: {
        target?: RawTarget[];
    };
}

export function parseBlameXml(xml: string): BlameEntry[] {
    const parsed = parseXml<RawBlame>(xml);
    const targets = parsed?.blame?.target ?? [];
    const results: BlameEntry[] = [];

    for (const target of targets) {
        for (const e of target.entry ?? []) {
            results.push({
                lineNumber: e['line-number'] ?? 0,
                revision: e.commit?.revision,
                author: e.commit?.author,
                date: e.commit?.date,
                mergedPath: e.merged?.path,
                mergedRevision: e.merged?.commit?.revision,
                mergedAuthor: e.merged?.commit?.author,
                mergedDate: e.merged?.commit?.date,
            });
        }
    }

    return results;
}
