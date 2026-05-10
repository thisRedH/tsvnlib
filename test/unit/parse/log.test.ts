import { describe, it, expect } from 'vitest';
import { parseLogXml } from '../../../src/parse/log.js';

const SIMPLE_LOG_XML = `<?xml version="1.0" encoding="UTF-8"?>
<log>
    <logentry revision="42">
        <author>alice</author>
        <date>2024-01-15T10:30:00.000000Z</date>
        <msg>Fix the bug</msg>
    </logentry>
    <logentry revision="41">
        <author>bob</author>
        <date>2024-01-14T09:00:00.000000Z</date>
        <msg>Add feature</msg>
    </logentry>
</log>`;

const VERBOSE_LOG_XML = `<?xml version="1.0" encoding="UTF-8"?>
<log>
    <logentry revision="10">
        <author>charlie</author>
        <date>2024-03-01T12:00:00.000000Z</date>
        <paths>
            <path action="M" kind="file" text-mods="true" prop-mods="false">/trunk/src/main.ts</path>
            <path action="A" kind="dir" text-mods="false" prop-mods="false" copyfrom-path="/trunk/old" copyfrom-rev="9">/trunk/new</path>
            <path action="D" kind="file" text-mods="false" prop-mods="false">/trunk/deleted.txt</path>
        </paths>
        <msg>Refactor code</msg>
    </logentry>
</log>`;

const REVPROPS_LOG_XML = `<?xml version="1.0" encoding="UTF-8"?>
<log>
    <logentry revision="5">
        <author>dave</author>
        <date>2024-04-01T00:00:00.000000Z</date>
        <msg>Test revprops</msg>
        <revprops>
            <property name="svn:log">Test revprops</property>
            <property name="svn:author">dave</property>
        </revprops>
    </logentry>
</log>`;

const MERGE_LOG_XML = `<?xml version="1.0" encoding="UTF-8"?>
<log>
    <logentry revision="20" reverse-merge="false">
        <author>eve</author>
        <date>2024-05-01T00:00:00.000000Z</date>
        <msg>Merge branch</msg>
        <logentry revision="15">
            <author>frank</author>
            <date>2024-04-15T00:00:00.000000Z</date>
            <msg>Child commit</msg>
        </logentry>
    </logentry>
</log>`;

describe('parseLogXml', () => {
    describe('simple log', () => {
        const entries = parseLogXml(SIMPLE_LOG_XML);

        it('returns correct number of entries', () => {
            expect(entries).toHaveLength(2);
        });

        it('parses revision numbers', () => {
            expect(entries[0].revision).toBe(42);
            expect(entries[1].revision).toBe(41);
        });

        it('parses author and date', () => {
            expect(entries[0].author).toBe('alice');
            expect(entries[0].date).toBe('2024-01-15T10:30:00.000000Z');
        });

        it('parses message', () => {
            expect(entries[0].message).toBe('Fix the bug');
            expect(entries[1].message).toBe('Add feature');
        });

        it('has no paths when not verbose', () => {
            expect(entries[0].paths).toBeUndefined();
        });
    });

    describe('verbose log with paths', () => {
        const entries = parseLogXml(VERBOSE_LOG_XML);

        it('parses paths array', () => {
            expect(entries[0].paths).toHaveLength(3);
        });

        it('parses modified path', () => {
            const modified = entries[0].paths![0];
            expect(modified.action).toBe('M');
            expect(modified.kind).toBe('file');
            expect(modified.path).toBe('/trunk/src/main.ts');
            expect(modified.textMods).toBe(true);
            expect(modified.propMods).toBe(false);
        });

        it('parses added path with copyfrom', () => {
            const added = entries[0].paths![1];
            expect(added.action).toBe('A');
            expect(added.kind).toBe('dir');
            expect(added.copiedFromPath).toBe('/trunk/old');
            expect(added.copiedFromRev).toBe(9);
        });

        it('parses deleted path', () => {
            const deleted = entries[0].paths![2];
            expect(deleted.action).toBe('D');
            expect(deleted.path).toBe('/trunk/deleted.txt');
        });
    });

    describe('log with revprops', () => {
        const entries = parseLogXml(REVPROPS_LOG_XML);

        it('parses revprops', () => {
            expect(entries[0].revprops).toBeDefined();
            expect(entries[0].revprops!['svn:log']).toBe('Test revprops');
            expect(entries[0].revprops!['svn:author']).toBe('dave');
        });
    });

    describe('merge log with children', () => {
        const entries = parseLogXml(MERGE_LOG_XML);

        it('parses child entries', () => {
            expect(entries[0].children).toHaveLength(1);
            expect(entries[0].children![0].revision).toBe(15);
            expect(entries[0].children![0].author).toBe('frank');
        });

        it('parses reverse-merge flag', () => {
            expect(entries[0].reverseMerge).toBe(false);
        });
    });

    it('returns empty array for empty log', () => {
        const result = parseLogXml('<?xml version="1.0"?><log></log>');
        expect(result).toEqual([]);
    });
});
