import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';
import { SvnClient } from '../../src/index.js';
import { nodeRunner } from '../../src/runners/node.js';
import {
    isSvnAvailable,
    createTestRepo,
    type TestRepo,
} from './helpers/repo.js';

const skipIfNoSvn = !isSvnAvailable();

describe.skipIf(skipIfNoSvn)('commit (integration)', () => {
    let repo: TestRepo;
    let client: SvnClient;

    beforeAll(() => {
        repo = createTestRepo();
        client = new SvnClient(nodeRunner, { cwd: repo.wcPath, nonInteractive: true });
    });

    afterAll(() => {
        repo.cleanup();
    });

    it('commits a modified file and returns the new revision', async () => {
        const filePath = join(repo.wcPath, 'README.txt');
        writeFileSync(filePath, 'Updated by commit test\n');

        const result = await client.commit(undefined, {
            message: 'update README from commit test',
        });

        expect(result).toHaveProperty('revision');
        expect(typeof result.revision).toBe('number');
        expect(result.revision).toBeGreaterThan(0);
    });

    it('commits a new file and returns an incremented revision', async () => {
        const filePath = join(repo.wcPath, 'commit-new.txt');
        writeFileSync(filePath, 'new file content\n');
        execSync(`svn add "${filePath}" --non-interactive`);

        const firstResult = await client.commit(undefined, {
            message: 'add commit-new.txt',
        });

        const filePath2 = join(repo.wcPath, 'commit-new2.txt');
        writeFileSync(filePath2, 'second new file\n');
        execSync(`svn add "${filePath2}" --non-interactive`);

        const secondResult = await client.commit(undefined, {
            message: 'add commit-new2.txt',
        });

        expect(secondResult.revision).toBeGreaterThan(firstResult.revision);
    });

    it('commits specific paths', async () => {
        const filePath = join(repo.wcPath, 'commit-specific.txt');
        writeFileSync(filePath, 'specific path commit\n');
        execSync(`svn add "${filePath}" --non-interactive`);

        const result = await client.commit([filePath], {
            message: 'commit specific path',
        });

        expect(typeof result.revision).toBe('number');
        expect(result.revision).toBeGreaterThan(0);
    });

    it('log confirms the commit message was recorded', async () => {
        const filePath = join(repo.wcPath, 'log-confirm.txt');
        writeFileSync(filePath, 'log confirm content\n');
        execSync(`svn add "${filePath}" --non-interactive`);

        await client.commit(undefined, { message: 'unique-commit-message-12345' });

        const logEntries = await client.log(repo.repoUrl, undefined, { limit: 1 });
        expect(logEntries[0].message).toBe('unique-commit-message-12345');
    });
});
