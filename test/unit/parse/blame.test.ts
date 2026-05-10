import { describe, it, expect } from 'vitest';
import { parseBlameXml } from '../../../src/parse/blame.js';

const BLAME_XML = `<?xml version="1.0" encoding="UTF-8"?>
<blame>
    <target path="src/main.ts">
        <entry line-number="1">
            <commit revision="5">
                <author>alice</author>
                <date>2024-01-01T00:00:00.000000Z</date>
            </commit>
        </entry>
        <entry line-number="2">
            <commit revision="10">
                <author>bob</author>
                <date>2024-02-01T00:00:00.000000Z</date>
            </commit>
        </entry>
        <entry line-number="3">
            <commit revision="7">
                <author>charlie</author>
                <date>2024-01-15T00:00:00.000000Z</date>
            </commit>
        </entry>
    </target>
</blame>`;

const BLAME_WITH_MERGE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<blame>
    <target path="merged.ts">
        <entry line-number="1">
            <commit revision="20">
                <author>alice</author>
                <date>2024-03-01T00:00:00.000000Z</date>
            </commit>
            <merged path="/branch/foo">
                <commit revision="15">
                    <author>bob</author>
                    <date>2024-02-15T00:00:00.000000Z</date>
                </commit>
            </merged>
        </entry>
    </target>
</blame>`;

const MULTI_TARGET_BLAME_XML = `<?xml version="1.0" encoding="UTF-8"?>
<blame>
    <target path="file1.ts">
        <entry line-number="1">
            <commit revision="1">
                <author>alice</author>
                <date>2024-01-01T00:00:00.000000Z</date>
            </commit>
        </entry>
    </target>
    <target path="file2.ts">
        <entry line-number="1">
            <commit revision="2">
                <author>bob</author>
                <date>2024-01-02T00:00:00.000000Z</date>
            </commit>
        </entry>
    </target>
</blame>`;

describe('parseBlameXml', () => {
    describe('simple blame', () => {
        const entries = parseBlameXml(BLAME_XML);

        it('parses all lines', () => {
            expect(entries).toHaveLength(3);
        });

        it('parses line numbers', () => {
            expect(entries[0].lineNumber).toBe(1);
            expect(entries[1].lineNumber).toBe(2);
            expect(entries[2].lineNumber).toBe(3);
        });

        it('parses revision for each line', () => {
            expect(entries[0].revision).toBe(5);
            expect(entries[1].revision).toBe(10);
            expect(entries[2].revision).toBe(7);
        });

        it('parses author for each line', () => {
            expect(entries[0].author).toBe('alice');
            expect(entries[1].author).toBe('bob');
        });

        it('parses date for each line', () => {
            expect(entries[0].date).toBe('2024-01-01T00:00:00.000000Z');
        });

        it('has no merge info', () => {
            expect(entries[0].mergedPath).toBeUndefined();
        });
    });

    describe('blame with merge history', () => {
        const entries = parseBlameXml(BLAME_WITH_MERGE_XML);

        it('parses merged info', () => {
            expect(entries[0].mergedPath).toBe('/branch/foo');
            expect(entries[0].mergedRevision).toBe(15);
            expect(entries[0].mergedAuthor).toBe('bob');
            expect(entries[0].mergedDate).toBe('2024-02-15T00:00:00.000000Z');
        });

        it('also parses current revision', () => {
            expect(entries[0].revision).toBe(20);
            expect(entries[0].author).toBe('alice');
        });
    });

    describe('multiple targets', () => {
        const entries = parseBlameXml(MULTI_TARGET_BLAME_XML);

        it('concatenates all entries from all targets', () => {
            expect(entries).toHaveLength(2);
        });

        it('preserves order', () => {
            expect(entries[0].revision).toBe(1);
            expect(entries[1].revision).toBe(2);
        });
    });

    it('returns empty array for empty blame', () => {
        const result = parseBlameXml('<?xml version="1.0"?><blame></blame>');
        expect(result).toEqual([]);
    });
});
