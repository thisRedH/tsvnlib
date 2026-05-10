import { XMLParser } from 'fast-xml-parser';

const FORCE_ARRAY_TAGS = new Set([
    'entry',
    'logentry',
    'path',
    'property',
    'target',
    'list',
    'changelist',
]);

export function createXmlParser(): XMLParser {
    return new XMLParser({
        attributeNamePrefix: '',
        ignoreAttributes: false,
        parseAttributeValue: true,
        isArray: (tagName: string, _jPath, _isLeaf: boolean, isAttribute: boolean) => {
            return !isAttribute && FORCE_ARRAY_TAGS.has(tagName)
        },
    });
}

export function parseBool(v: boolean | string | undefined): boolean {
    return v != null
        && v !== false
        && v !== 'false';
}

export function parseXml<T>(xml: string): T {
    const parser = createXmlParser();
    return parser.parse(xml) as T;
}
