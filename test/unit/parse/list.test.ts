import { describe, it, expect } from 'vitest';
import { parseListXml } from '../../../src/parse/list.js';

const LIST_XML = `<?xml version="1.0" encoding="UTF-8"?>
<lists>
    <list path="https://svn.example.com/repos/trunk">
        <entry kind="file">
            <name>README.md</name>
            <size>1234</size>
            <commit revision="42">
                <author>alice</author>
                <date>2024-01-15T10:30:00.000000Z</date>
            </commit>
        </entry>
        <entry kind="dir">
            <name>src</name>
            <commit revision="40">
                <author>bob</author>
                <date>2024-01-10T08:00:00.000000Z</date>
            </commit>
        </entry>
        <entry kind="file">
            <name>locked.txt</name>
            <size>512</size>
            <commit revision="35">
                <author>charlie</author>
                <date>2024-01-05T09:00:00.000000Z</date>
            </commit>
            <lock>
                <token>opaquelocktoken:abc</token>
                <owner>charlie</owner>
                <comment>locked</comment>
                <created>2024-01-05T10:00:00.000000Z</created>
            </lock>
        </entry>
    </list>
</lists>`;

const MULTI_TARGET_XML = `<?xml version="1.0" encoding="UTF-8"?>
<lists>
    <list path="https://svn.example.com/repos/trunk">
        <entry kind="file">
            <name>file1.txt</name>
            <commit revision="1">
                <author>user</author>
                <date>2024-01-01T00:00:00.000000Z</date>
            </commit>
        </entry>
    </list>
    <list path="https://svn.example.com/repos/branches/feature">
        <entry kind="file">
            <name>file2.txt</name>
            <commit revision="2">
                <author>user</author>
                <date>2024-01-02T00:00:00.000000Z</date>
            </commit>
        </entry>
    </list>
</lists>`;

describe('parseListXml', () => {
    describe('single target', () => {
        const result = parseListXml(LIST_XML);

        it('returns map with one key', () => {
            expect(result.size).toBe(1);
            expect(result.has('https://svn.example.com/repos/trunk')).toBe(true);
        });

        it('parses all entries', () => {
            const entries = result.get('https://svn.example.com/repos/trunk')!;
            expect(entries).toHaveLength(3);
        });

        it('parses file entry', () => {
            const entries = result.get('https://svn.example.com/repos/trunk')!;
            expect(entries[0].name).toBe('README.md');
            expect(entries[0].kind).toBe('file');
            expect(entries[0].size).toBe(1234);
        });

        it('parses commit info', () => {
            const entries = result.get('https://svn.example.com/repos/trunk')!;
            expect(entries[0].lastChangedRev).toBe(42);
            expect(entries[0].lastChangedAuthor).toBe('alice');
            expect(entries[0].lastChangedDate).toBe('2024-01-15T10:30:00.000000Z');
        });

        it('parses directory entry without size', () => {
            const entries = result.get('https://svn.example.com/repos/trunk')!;
            expect(entries[1].name).toBe('src');
            expect(entries[1].kind).toBe('dir');
            expect(entries[1].size).toBeUndefined();
        });

        it('parses locked file', () => {
            const entries = result.get('https://svn.example.com/repos/trunk')!;
            expect(entries[2].locked).toBe(true);
        });
    });

    describe('multiple targets', () => {
        const result = parseListXml(MULTI_TARGET_XML);

        it('returns map with multiple keys', () => {
            expect(result.size).toBe(2);
        });

        it('separates entries by target', () => {
            const trunk = result.get('https://svn.example.com/repos/trunk')!;
            const branch = result.get('https://svn.example.com/repos/branches/feature')!;
            expect(trunk[0].name).toBe('file1.txt');
            expect(branch[0].name).toBe('file2.txt');
        });
    });

    it('returns empty map for empty lists', () => {
        const result = parseListXml('<?xml version="1.0"?><lists></lists>');
        expect(result.size).toBe(0);
    });
});
