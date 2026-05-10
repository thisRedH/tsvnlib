import { parseXml, parseBool } from './xml.js';

export interface LogPathEntry {
    action: 'A' | 'D' | 'R' | 'M';
    kind: 'file' | 'dir' | '';
    path: string;
    textMods?: boolean;
    propMods?: boolean;
    copiedFromPath?: string;
    copiedFromRev?: number;
}

export interface LogEntry {
    revision: number;
    author?: string;
    date?: string;
    message?: string;
    paths?: LogPathEntry[];
    revprops?: Record<string, string>;
    reverseMerge?: boolean;
    children?: LogEntry[];
}

interface RawPath {
    '#text'?: string;
    action?: string;
    kind?: string;
    'text-mods'?: boolean | string;
    'prop-mods'?: boolean | string;
    'copyfrom-path'?: string;
    'copyfrom-rev'?: number;
}

interface RawRevpropProperty {
    '#text'?: string;
    name?: string;
    encoding?: string;
}

interface RawLogEntry {
    revision?: number;
    'reverse-merge'?: boolean | string;
    author?: string;
    date?: string;
    msg?: string;
    paths?: {
        path?: RawPath[];
    };
    revprops?: {
        property?: RawRevpropProperty[];
    };
    logentry?: RawLogEntry[];
}

interface RawLog {
    log?: {
        logentry?: RawLogEntry[];
    };
}

function parseLogEntry(raw: RawLogEntry): LogEntry {
    const paths: LogPathEntry[] | undefined = 
        raw.paths?.path?.map((p) => ({
            action: (p.action as LogPathEntry['action']) ?? 'M',
            kind: (p.kind as LogPathEntry['kind']) ?? '',
            path: p['#text'] ?? '',
            textMods: parseBool(p['text-mods']),
            propMods: parseBool(p['prop-mods']),
            copiedFromPath: p['copyfrom-path'],
            copiedFromRev: p['copyfrom-rev'],
        })
    );

    const revprops: Record<string, string> | undefined =
        raw.revprops?.property
            ? Object.fromEntries(
                (raw.revprops.property ?? []).map((p) => [
                    p.name ?? '',
                    p['#text'] ?? ''
                ]),
            )
            : undefined;

    const children: LogEntry[] | undefined = raw.logentry?.map(parseLogEntry);

    return {
        revision: raw.revision ?? 0,
        author: raw.author,
        date: raw.date,
        message: raw.msg,
        paths: paths && paths.length > 0 ? paths : undefined,
        revprops,
        reverseMerge: parseBool(raw['reverse-merge']),
        children: children || undefined,
    };
}

export function parseLogXml(xml: string): LogEntry[] {
    const parsed = parseXml<RawLog>(xml);
    const entries = parsed?.log?.logentry ?? [];
    return entries.map(parseLogEntry);
}
