import { describe, it, expect } from 'vitest';
import { parseInfoXml } from '../../../src/parse/info.js';

const SIMPLE_INFO_XML = `<?xml version="1.0" encoding="UTF-8"?>
<info>
    <entry path="." kind="dir" revision="42">
        <url>https://svn.example.com/repos/trunk</url>
        <relative-url>^/trunk</relative-url>
        <repository>
            <root>https://svn.example.com/repos</root>
            <uuid>abc123-def456</uuid>
        </repository>
        <wc-info>
            <wcroot-abspath>/home/user/wc</wcroot-abspath>
            <wc-compatible-version>1.8</wc-compatible-version>
            <wc-format>29</wc-format>
            <store-pristine>yes</store-pristine>
            <schedule>normal</schedule>
            <depth>infinity</depth>
        </wc-info>
        <commit revision="40">
            <author>alice</author>
            <date>2024-01-15T10:30:00.000000Z</date>
        </commit>
    </entry>
</info>`;

const FILE_WITH_LOCK_XML = `<?xml version="1.0" encoding="UTF-8"?>
<info>
    <entry path="file.txt" kind="file" revision="100">
        <url>https://svn.example.com/repos/trunk/file.txt</url>
        <relative-url>^/trunk/file.txt</relative-url>
        <repository>
            <root>https://svn.example.com/repos</root>
            <uuid>abc123</uuid>
        </repository>
        <wc-info>
            <schedule>normal</schedule>
            <depth>infinity</depth>
        </wc-info>
        <commit revision="99">
            <author>bob</author>
            <date>2024-02-01T08:00:00.000000Z</date>
        </commit>
        <lock>
            <token>opaquelocktoken:abc</token>
            <owner>bob</owner>
            <comment>Working on it</comment>
            <created>2024-02-01T09:00:00.000000Z</created>
            <expires>2024-02-02T09:00:00.000000Z</expires>
        </lock>
    </entry>
</info>`;

const TREE_CONFLICT_XML = `<?xml version="1.0" encoding="UTF-8"?>
<info>
    <entry path="conflicted.txt" kind="file" revision="50">
        <url>https://svn.example.com/repos/trunk/conflicted.txt</url>
        <relative-url>^/trunk/conflicted.txt</relative-url>
        <repository>
            <root>https://svn.example.com/repos</root>
            <uuid>abc123</uuid>
        </repository>
        <wc-info>
            <schedule>normal</schedule>
        </wc-info>
        <commit revision="49">
            <author>charlie</author>
            <date>2024-03-01T00:00:00.000000Z</date>
        </commit>
        <tree-conflict victim="conflicted.txt" kind="file" operation="update" action="edit" reason="delete"/>
    </entry>
</info>`;

describe('parseInfoXml', () => {
    describe('simple directory entry', () => {
        const entries = parseInfoXml(SIMPLE_INFO_XML);

        it('returns array with one entry', () => {
            expect(entries).toHaveLength(1);
        });

        it('parses path and kind', () => {
            expect(entries[0].path).toBe('.');
            expect(entries[0].kind).toBe('dir');
        });

        it('parses revision', () => {
            expect(entries[0].revision).toBe(42);
        });

        it('parses url and relative-url', () => {
            expect(entries[0].url).toBe('https://svn.example.com/repos/trunk');
            expect(entries[0].relativeUrl).toBe('^/trunk');
        });

        it('parses repository root and uuid', () => {
            expect(entries[0].reposRootUrl).toBe('https://svn.example.com/repos');
            expect(entries[0].reposUuid).toBe('abc123-def456');
        });

        it('resolves absolutePath from wcRoot and path', () => {
            expect(entries[0].absolutePath).toBe('/home/user/wc');
        });

        it('parses wc-info fields', () => {
            expect(entries[0].wcRoot).toBe('/home/user/wc');
            expect(entries[0].wcCompatibleVersion).toBe('1.8');
            expect(entries[0].wcFormat).toBe(29);
            expect(entries[0].storePristine).toBe('yes');
            expect(entries[0].schedule).toBe('normal');
            expect(entries[0].depth).toBe('infinity');
        });

        it('parses commit info', () => {
            expect(entries[0].lastChangedRev).toBe(40);
            expect(entries[0].lastChangedAuthor).toBe('alice');
            expect(entries[0].lastChangedDate).toBe('2024-01-15T10:30:00.000000Z');
        });

        it('has no lock', () => {
            expect(entries[0].lock).toBeUndefined();
        });
    });

    describe('file without wcRoot', () => {
        it('absolutePath is undefined when wcRoot is absent', () => {
            const entries = parseInfoXml(FILE_WITH_LOCK_XML);
            expect(entries[0].absolutePath).toBeUndefined();
        });
    });

    describe('file with lock', () => {
        const entries = parseInfoXml(FILE_WITH_LOCK_XML);

        it('parses lock fields', () => {
            expect(entries[0].lock).toBeDefined();
            expect(entries[0].lock!.token).toBe('opaquelocktoken:abc');
            expect(entries[0].lock!.owner).toBe('bob');
            expect(entries[0].lock!.comment).toBe('Working on it');
            expect(entries[0].lock!.created).toBe('2024-02-01T09:00:00.000000Z');
            expect(entries[0].lock!.expires).toBe('2024-02-02T09:00:00.000000Z');
        });
    });

    describe('tree conflict', () => {
        const entries = parseInfoXml(TREE_CONFLICT_XML);

        it('parses tree-conflict attributes', () => {
            expect(entries[0].treeConflict).toBeDefined();
            expect(entries[0].treeConflict!.victim).toBe('conflicted.txt');
            expect(entries[0].treeConflict!.kind).toBe('file');
            expect(entries[0].treeConflict!.operation).toBe('update');
            expect(entries[0].treeConflict!.action).toBe('edit');
            expect(entries[0].treeConflict!.reason).toBe('delete');
        });
    });

    it('returns empty array for empty info', () => {
        const result = parseInfoXml('<?xml version="1.0"?><info></info>');
        expect(result).toEqual([]);
    });
});
