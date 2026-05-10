import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { SvnClient } from '../../src/index.js';
import { nodeRunner } from '../../src/runners/node.js';
import {
    isSvnAvailable,
    createTestRepo,
    type TestRepo,
} from './helpers/repo.js';

const skipIfNoSvn = !isSvnAvailable();

describe.skipIf(skipIfNoSvn)('status (integration)', () => {
    let repo: TestRepo;
    let client: SvnClient;

    beforeAll(() => {
        repo = createTestRepo();
        client = new SvnClient(nodeRunner, { cwd: repo.wcPath, nonInteractive: true });
    });

    afterAll(() => {
        repo.cleanup();
    });

    it('returns empty array when working copy is clean', async () => {
        const entries = await client.status();
        // Initial checkout may show nothing or only versioned items with 'normal' status
        // Filter to non-normal items
        const modified = entries.filter((e) => e.item !== 'normal');
        expect(modified).toHaveLength(0);
    });

    it('reports modified files', async () => {
        const filePath = join(repo.wcPath, 'README.txt');
        writeFileSync(filePath, 'Modified content\n');

        const entries = await client.status();
        const modEntry = entries.find((e) => e.path.includes('README.txt'));
        expect(modEntry).toBeDefined();
        expect(modEntry!.item).toBe('modified');
    });

    it('reports unversioned files', async () => {
        const filePath = join(repo.wcPath, 'unversioned.txt');
        writeFileSync(filePath, 'unversioned\n');

        const entries = await client.status();
        const uvEntry = entries.find((e) => e.path.includes('unversioned.txt'));
        expect(uvEntry).toBeDefined();
        expect(uvEntry!.item).toBe('unversioned');
    });

    it('parses boolean flags', async () => {
        const entries = await client.status();
        for (const e of entries) {
            expect(typeof e.wcLocked).toBe('boolean');
            expect(typeof e.copied).toBe('boolean');
            expect(typeof e.switched).toBe('boolean');
            expect(typeof e.treeConflicted).toBe('boolean');
        }
    });

    it('reports added files', async () => {
        const filePath = join(repo.wcPath, 'added.txt');
        writeFileSync(filePath, 'to be added\n');

        const { execSync } = await import('node:child_process');
        execSync(`svn add "${filePath}" --non-interactive`);

        const entries = await client.status();
        const addedEntry = entries.find((e) => e.path.includes('added.txt'));
        expect(addedEntry).toBeDefined();
        expect(addedEntry!.item).toBe('added');
    });
});
