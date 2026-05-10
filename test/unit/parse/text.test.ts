import { describe, it, expect } from 'vitest';
import {
    parseCommitRevision,
    parseUpdateRevision,
    parseSvnVersion,
} from '../../../src/parse/text.js';

describe('parseCommitRevision', () => {
    it('parses simple commit output', () => {
        expect(parseCommitRevision('Committed revision 42.')).toBe(42);
    });

    it('parses commit output with preceding lines', () => {
        const output = `Adding         src/main.ts
Transmitting file data .done
Committing transaction...
Committed revision 123.`;
        expect(parseCommitRevision(output)).toBe(123);
    });

    it('parses large revision number', () => {
        expect(parseCommitRevision('Committed revision 999999.')).toBe(999999);
    });

    it('throws for non-matching output', () => {
        expect(() => parseCommitRevision('Nothing to commit')).toThrow();
    });
});

describe('parseUpdateRevision', () => {
    it('parses "Updated to revision" format', () => {
        expect(parseUpdateRevision('Updated to revision 50.')).toBe(50);
    });

    it('parses "At revision" format', () => {
        expect(parseUpdateRevision('At revision 50.')).toBe(50);
    });

    it('parses "Checked out revision" format', () => {
        expect(parseUpdateRevision('Checked out revision 50.')).toBe(50);
    });

    it('parses "Exported revision" format', () => {
        expect(parseUpdateRevision('Exported revision 50.')).toBe(50);
    });

    it('parses output with preceding lines', () => {
        const output = `Updating '.':\nA    newfile.txt\nUpdated to revision 100.`;
        expect(parseUpdateRevision(output)).toBe(100);
    });

    it('throws for non-matching output', () => {
        expect(() => parseUpdateRevision('Nothing to update')).toThrow();
    });
});

describe('parseSvnVersion', () => {
    it('parses full version string', () => {
        const output = `svn, version 1.14.2 (r1899510)
      compiled May  6 2022, 16:18:52 on x86_64-apple-darwin19.6.0

Copyright (C) 2021 The Apache Software Foundation.`;
        const v = parseSvnVersion(output);
        expect(v.version).toBe('1.14.2');
        expect(v.major).toBe(1);
        expect(v.minor).toBe(14);
        expect(v.patch).toBe(2);
    });

    it('parses quiet version output', () => {
        const v = parseSvnVersion('1.14.2\n');
        expect(v.version).toBe('1.14.2');
        expect(v.major).toBe(1);
        expect(v.minor).toBe(14);
        expect(v.patch).toBe(2);
    });

    it('parses version 1.10.0', () => {
        const v = parseSvnVersion('1.10.0\n');
        expect(v.major).toBe(1);
        expect(v.minor).toBe(10);
        expect(v.patch).toBe(0);
    });

    it('throws for invalid version string', () => {
        expect(() => parseSvnVersion('not a version')).toThrow();
    });
});
