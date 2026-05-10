import { parseXml } from './xml.js';

export interface PropEntry {
    name: string;
    value?: string;
}

interface RawProperty {
    '#text'?: string | number;
    name?: string;
    encoding?: string;
}

interface RawTarget {
    path?: string;
    property?: RawProperty[];
}

interface RawRevprops {
    rev?: number;
    property?: RawProperty[];
}

interface RawProperties {
    properties?: {
        target?: RawTarget[];
        revprops?: RawRevprops;
    };
}

function decodeProperty(raw: RawProperty): PropEntry {
    let value: string | undefined;

    if (raw['#text'] !== undefined) {
        value = String(raw['#text']);

        // If base64 encoded, decode it
        if (raw.encoding === 'base64') {
            try {
                value = atob(value.trim());
            } catch {
                // leave as-is if decode fails
            }
        }
    }

    return {
        name: raw.name ?? '',
        value,
    };
}

export function parseProplistXml(xml: string): Map<string, PropEntry[]> {
    const parsed = parseXml<RawProperties>(xml);
    const result = new Map<string, PropEntry[]>();

    const targets = parsed?.properties?.target ?? [];
    for (const target of targets) {
        const key = target.path ?? '';
        const props = (target.property ?? []).map(decodeProperty);
        result.set(key, props);
    }

    return result;
}

export function parsePropgetXml(xml: string): string {
    const parsed = parseXml<RawProperties>(xml);

    const targets = parsed?.properties?.target ?? [];
    if (targets.length === 0) {
        return '';
    }

    const props = targets[0].property ?? [];
    if (props.length === 0) {
        return '';
    }

    return decodeProperty(props[0]).value ?? '';
}
