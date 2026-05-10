import { describe, it, expect } from 'vitest';
import { buildArgs, serializeRevision } from '../../src/args.js';

describe('buildArgs', () => {
    it('omits undefined values', () => {
        expect(buildArgs({ depth: undefined })).toEqual([]);
    });

    it('omits false values', () => {
        expect(buildArgs({ quiet: false })).toEqual([]);
    });

    it('omits null values', () => {
        expect(buildArgs({ quiet: null })).toEqual([]);
    });

    it('appends flag for boolean true (long flag)', () => {
        expect(buildArgs({ force: true })).toEqual(['--force']);
    });

    it('appends short flag -q for quiet:true', () => {
        expect(buildArgs({ quiet: true })).toEqual(['-q']);
    });

    it('appends short flag -v for verbose:true', () => {
        expect(buildArgs({ verbose: true })).toEqual(['-v']);
    });

    it('appends short flag -R for recursive:true', () => {
        expect(buildArgs({ recursive: true })).toEqual(['-R']);
    });

    it('appends -m VALUE for message', () => {
        expect(buildArgs({ message: 'hello world' })).toEqual(['-m', 'hello world']);
    });

    it('appends -F VALUE for file', () => {
        expect(buildArgs({ file: '/tmp/msg.txt' })).toEqual(['-F', '/tmp/msg.txt']);
    });

    it('appends -x VALUE for extensions', () => {
        expect(buildArgs({ extensions: '-b' })).toEqual(['-x', '-b']);
    });

    it('appends -r VALUE for revision number', () => {
        expect(buildArgs({ revision: 42 })).toEqual(['-r', '42']);
    });

    it('appends -r VALUE for revision keyword', () => {
        expect(buildArgs({ revision: 'HEAD' })).toEqual(['-r', 'HEAD']);
    });

    it('appends -r VALUE for revision date template', () => {
        expect(buildArgs({ revision: '{2024-01-01}' as `{${string}}`})).toEqual(['-r', '{2024-01-01}']);
    });

    it('appends string option as --flag VALUE', () => {
        expect(buildArgs({ depth: 'infinity' })).toEqual(['--depth', 'infinity']);
    });

    it('appends number option as --flag VALUE', () => {
        expect(buildArgs({ limit: 10 })).toEqual(['--limit', '10']);
    });

    it('converts camelCase to kebab-case for long flags', () => {
        expect(buildArgs({ noIgnore: true })).toEqual(['--no-ignore']);
        expect(buildArgs({ stopOnCopy: true })).toEqual(['--stop-on-copy']);
    });

    it('repeats flag for string array values', () => {
        expect(buildArgs({ changelist: ['cl1', 'cl2'] })).toEqual([
            '--changelist', 'cl1',
            '--changelist', 'cl2',
        ]);
    });

    it('handles single-element string array', () => {
        expect(buildArgs({ changelist: ['myCL'] })).toEqual(['--changelist', 'myCL']);
    });

    it('handles multiple options together', () => {
        const result = buildArgs({ quiet: true, depth: 'infinity', limit: 5 });
        expect(result).toContain('-q');
        expect(result).toContain('--depth');
        expect(result).toContain('infinity');
        expect(result).toContain('--limit');
        expect(result).toContain('5');
    });
});

describe('serializeRevision', () => {
    it('converts number to string', () => {
        expect(serializeRevision(42)).toBe('42');
    });

    it('passes through HEAD keyword', () => {
        expect(serializeRevision('HEAD')).toBe('HEAD');
    });

    it('passes through BASE keyword', () => {
        expect(serializeRevision('BASE')).toBe('BASE');
    });

    it('passes through COMMITTED keyword', () => {
        expect(serializeRevision('COMMITTED')).toBe('COMMITTED');
    });

    it('passes through PREV keyword', () => {
        expect(serializeRevision('PREV')).toBe('PREV');
    });

    it('passes through date template as-is', () => {
        expect(serializeRevision('{2024-01-01}' as `{${string}}`)).toBe('{2024-01-01}');
    });
});
