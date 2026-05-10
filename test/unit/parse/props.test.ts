import { describe, it, expect } from 'vitest';
import { parseProplistXml, parsePropgetXml } from '../../../src/parse/props.js';

const PROPLIST_XML = `<?xml version="1.0" encoding="UTF-8"?>
<properties>
    <target path="src/main.ts">
        <property name="svn:keywords">Id Rev Author Date</property>
        <property name="svn:eol-style">native</property>
    </target>
    <target path="README.md">
        <property name="svn:mime-type">text/plain</property>
    </target>
</properties>`;

const PROPLIST_BASE64_XML = `<?xml version="1.0" encoding="UTF-8"?>
<properties>
    <target path="binary.bin">
        <property name="custom:data" encoding="base64">SGVsbG8gV29ybGQ=</property>
    </target>
</properties>`;

const PROPGET_XML = `<?xml version="1.0" encoding="UTF-8"?>
<properties>
    <target path="src/main.ts">
        <property name="svn:keywords">Id Rev</property>
    </target>
</properties>`;

describe('parseProplistXml', () => {
    describe('multiple targets', () => {
        const result = parseProplistXml(PROPLIST_XML);

        it('returns map with correct number of targets', () => {
            expect(result.size).toBe(2);
        });

        it('parses properties for first target', () => {
            const props = result.get('src/main.ts')!;
            expect(props).toHaveLength(2);
            expect(props[0].name).toBe('svn:keywords');
            expect(props[0].value).toBe('Id Rev Author Date');
            expect(props[1].name).toBe('svn:eol-style');
            expect(props[1].value).toBe('native');
        });

        it('parses properties for second target', () => {
            const props = result.get('README.md')!;
            expect(props).toHaveLength(1);
            expect(props[0].name).toBe('svn:mime-type');
            expect(props[0].value).toBe('text/plain');
        });
    });

    describe('base64 encoded property', () => {
        const result = parseProplistXml(PROPLIST_BASE64_XML);

        it('decodes base64 value', () => {
            const props = result.get('binary.bin')!;
            expect(props[0].name).toBe('custom:data');
            expect(props[0].value).toBe('Hello World');
        });
    });

    it('returns empty map for empty properties', () => {
        const result = parseProplistXml('<?xml version="1.0"?><properties></properties>');
        expect(result.size).toBe(0);
    });
});

describe('parsePropgetXml', () => {
    it('returns value of single property', () => {
        const value = parsePropgetXml(PROPGET_XML);
        expect(value).toBe('Id Rev');
    });

    it('returns empty string for empty properties', () => {
        const value = parsePropgetXml('<?xml version="1.0"?><properties></properties>');
        expect(value).toBe('');
    });
});
