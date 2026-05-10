import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { SvnClient } from '../../src/index.js';
import { nodeRunner } from '../../src/runners/node.js';
import {
    isSvnAvailable,
    createTestRepo,
    addAndCommit,
    type TestRepo,
} from './helpers/repo.js';

const skipIfNoSvn = !isSvnAvailable();

describe.skipIf(skipIfNoSvn)('info (integration)', () => {
    let repo: TestRepo;
    let client: SvnClient;

    beforeAll(() => {
        repo = createTestRepo();
        client = new SvnClient(nodeRunner, { cwd: repo.wcPath, nonInteractive: true });
    });

    afterAll(() => {
        repo.cleanup();
    });

    it('returns info entries for the working copy root', async () => {
        const entries = await client.info();
        expect(entries).toBeInstanceOf(Array);
        expect(entries.length).toBeGreaterThan(0);
    });

    it('parses the url field', async () => {
        const entries = await client.info();
        expect(entries[0].url).toBeDefined();
        expect(entries[0].url).toContain('trunk');
    });

    it('parses the revision as a number', async () => {
        const entries = await client.info();
        expect(typeof entries[0].revision).toBe('number');
        expect(entries[0].revision).toBeGreaterThan(0);
    });

    it('parses the kind', async () => {
        const entries = await client.info();
        expect(entries[0].kind).toBe('dir');
    });

    it('returns string when showItem is set', async () => {
        const result = await client.info([repo.wcPath], { showItem: 'url' });
        expect(typeof result).toBe('string');
        expect(result.trim()).toContain('trunk');
    });

    it('returns info for a specific file', async () => {
        addAndCommit(repo.wcPath, 'info-test.txt', 'hello\n', 'add info-test.txt');
        const entries = await client.info([`${repo.wcPath}/info-test.txt`]);
        expect(entries).toHaveLength(1);
        expect(entries[0].kind).toBe('file');
        expect(entries[0].url).toContain('info-test.txt');
    });
});
