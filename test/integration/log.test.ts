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

describe.skipIf(skipIfNoSvn)('log (integration)', () => {
    let repo: TestRepo;
    let client: SvnClient;

    beforeAll(() => {
        repo = createTestRepo();
        client = new SvnClient(nodeRunner, { cwd: repo.wcPath, nonInteractive: true });
        // Add a couple more commits so log has multiple entries
        addAndCommit(repo.wcPath, 'log-file-a.txt', 'content a\n', 'add log-file-a');
        addAndCommit(repo.wcPath, 'log-file-b.txt', 'content b\n', 'add log-file-b');
    });

    afterAll(() => {
        repo.cleanup();
    });

    it('returns an array of log entries', async () => {
        const entries = await client.log(repo.repoUrl);
        expect(entries).toBeInstanceOf(Array);
        expect(entries.length).toBeGreaterThan(0);
    });

    it('parses revision numbers as integers', async () => {
        const entries = await client.log(repo.repoUrl);
        for (const e of entries) {
            expect(typeof e.revision).toBe('number');
            expect(Number.isInteger(e.revision)).toBe(true);
        }
    });

    it('parses author field', async () => {
        const entries = await client.log(repo.repoUrl);
        for (const e of entries) {
            expect(typeof e.author).toBe('string');
        }
    });

    it('parses date field', async () => {
        const entries = await client.log(repo.repoUrl);
        expect(entries[0].date).toBeDefined();
    });

    it('parses commit message', async () => {
        const entries = await client.log(repo.repoUrl);
        const messages = entries.map((e) => e.message ?? '');
        expect(messages).toContain('add log-file-b');
        expect(messages).toContain('add log-file-a');
    });

    it('respects the limit option', async () => {
        const entries = await client.log(repo.repoUrl, undefined, { limit: 1 });
        expect(entries).toHaveLength(1);
    });

    it('returns entries in descending revision order by default', async () => {
        const entries = await client.log(repo.repoUrl);
        for (let i = 1; i < entries.length; i++) {
            expect(entries[i - 1].revision).toBeGreaterThan(entries[i].revision);
        }
    });

    it('returns verbose log with paths when verbose option is set', async () => {
        const entries = await client.log(repo.repoUrl, undefined, { verbose: true });
        expect(entries.length).toBeGreaterThan(0);
        // At least the most recent entry should have paths
        const withPaths = entries.find((e) => e.paths !== undefined);
        expect(withPaths).toBeDefined();
    });
});
