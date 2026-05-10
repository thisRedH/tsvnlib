import { describe, it, expect } from 'vitest';
import { parseStatusXml } from '../../../src/parse/status.js';

const SIMPLE_STATUS_XML = `<?xml version="1.0" encoding="UTF-8"?>
<status>
    <target path=".">
        <entry path="src/main.ts">
            <wc-status item="modified" props="none" revision="10" wc-locked="false" copied="false" switched="false" tree-conflicted="false">
                <commit revision="8">
                    <author>alice</author>
                    <date>2024-01-10T10:00:00.000000Z</date>
                </commit>
            </wc-status>
        </entry>
        <entry path="new-file.txt">
            <wc-status item="unversioned" props="none" wc-locked="false" copied="false" switched="false" tree-conflicted="false">
            </wc-status>
        </entry>
        <against revision="12"/>
    </target>
</status>`;

const SHOW_UPDATES_XML = `<?xml version="1.0" encoding="UTF-8"?>
<status>
    <target path=".">
        <entry path="outdated.ts">
            <wc-status item="normal" props="none" revision="5" wc-locked="false" copied="false" switched="false" tree-conflicted="false">
                <commit revision="5">
                    <author>bob</author>
                    <date>2024-01-01T00:00:00.000000Z</date>
                </commit>
            </wc-status>
            <repos-status item="modified" props="none"/>
        </entry>
        <against revision="10"/>
    </target>
</status>`;

const LOCKED_FILE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<status>
    <target path=".">
        <entry path="locked.txt">
            <wc-status item="normal" props="none" revision="7" wc-locked="false" copied="false" switched="false" tree-conflicted="false">
                <commit revision="7">
                    <author>charlie</author>
                    <date>2024-02-01T00:00:00.000000Z</date>
                </commit>
                <lock>
                    <token>opaquelocktoken:xyz</token>
                    <owner>charlie</owner>
                    <comment>locked</comment>
                    <created>2024-02-01T09:00:00.000000Z</created>
                </lock>
            </wc-status>
        </entry>
    </target>
</status>`;

const CHANGELIST_XML = `<?xml version="1.0" encoding="UTF-8"?>
<status>
    <target path=".">
    </target>
    <changelist name="myCL">
        <entry path="cl-file.ts">
            <wc-status item="added" props="none" wc-locked="false" copied="false" switched="false" tree-conflicted="false">
            </wc-status>
        </entry>
    </changelist>
</status>`;

describe('parseStatusXml', () => {
    describe('absolutePath', () => {
        it('is undefined when no cwd is provided', () => {
            const entries = parseStatusXml(SIMPLE_STATUS_XML);
            expect(entries[0].absolutePath).toBeUndefined();
        });

        it('resolves entry path against cwd and target path', () => {
            const entries = parseStatusXml(SIMPLE_STATUS_XML, '/home/user/wc');
            expect(entries[0].absolutePath).toBe('/home/user/wc/src/main.ts');
            expect(entries[1].absolutePath).toBe('/home/user/wc/new-file.txt');
        });

        it('resolves changelist entry paths against cwd', () => {
            const entries = parseStatusXml(CHANGELIST_XML, '/home/user/wc');
            expect(entries[0].absolutePath).toBe('/home/user/wc/cl-file.ts');
        });
    });

    describe('simple status', () => {
        const entries = parseStatusXml(SIMPLE_STATUS_XML);

        it('parses multiple entries', () => {
            expect(entries).toHaveLength(2);
        });

        it('parses path and item status', () => {
            expect(entries[0].path).toBe('src/main.ts');
            expect(entries[0].item).toBe('modified');
        });

        it('parses props status', () => {
            expect(entries[0].props).toBe('none');
        });

        it('parses revision', () => {
            expect(entries[0].revision).toBe(10);
        });

        it('parses boolean flags', () => {
            expect(entries[0].wcLocked).toBe(false);
            expect(entries[0].copied).toBe(false);
            expect(entries[0].switched).toBe(false);
            expect(entries[0].treeConflicted).toBe(false);
        });

        it('parses commit info', () => {
            expect(entries[0].lastCommitRev).toBe(8);
            expect(entries[0].lastCommitAuthor).toBe('alice');
            expect(entries[0].lastCommitDate).toBe('2024-01-10T10:00:00.000000Z');
        });

        it('parses against revision', () => {
            expect(entries[0].againstRevision).toBe(12);
        });

        it('parses unversioned file', () => {
            expect(entries[1].item).toBe('unversioned');
            expect(entries[1].path).toBe('new-file.txt');
        });
    });

    describe('show updates', () => {
        const entries = parseStatusXml(SHOW_UPDATES_XML);

        it('parses repos-status', () => {
            expect(entries[0].reposItem).toBe('modified');
            expect(entries[0].reposProps).toBe('none');
        });
    });

    describe('locked file', () => {
        const entries = parseStatusXml(LOCKED_FILE_XML);

        it('parses lock info', () => {
            expect(entries[0].locked).toBe(true);
            expect(entries[0].lockToken).toBe('opaquelocktoken:xyz');
            expect(entries[0].lockOwner).toBe('charlie');
        });
    });

    describe('changelist entries', () => {
        const entries = parseStatusXml(CHANGELIST_XML);

        it('includes entries from changelists', () => {
            expect(entries).toHaveLength(1);
            expect(entries[0].path).toBe('cl-file.ts');
            expect(entries[0].item).toBe('added');
        });
    });

    it('returns empty array for empty status', () => {
        const result = parseStatusXml('<?xml version="1.0"?><status><target path="."></target></status>');
        expect(result).toEqual([]);
    });
});
