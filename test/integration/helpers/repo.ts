import { execSync, spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

export interface TestRepo {
    repoUrl: string;
    wcPath: string;
    cleanup: () => void;
}

/**
  * Check whether svn and svnadmin are available in PATH.
  */
export function isSvnAvailable(): boolean {
    try {
        const svn = spawnSync('svn', ['--version', '--quiet'], { encoding: 'utf8' });
        const svnadmin = spawnSync('svnadmin', ['--version', '--quiet'], { encoding: 'utf8' });
        return svn.status === 0 && svnadmin.status === 0;
    } catch {
        return false;
    }
}

/**
  * Create a temp SVN repository and a working copy checked out from it.
  * Returns URLs and paths, plus a cleanup function.
  */
export function createTestRepo(): TestRepo {
    const tmpBase = mkdtempSync(join(tmpdir(), 'tsvnlib-test-'));
    const repoPath = join(tmpBase, 'repo');
    const wcPath = join(tmpBase, 'wc');

    // Create repo
    execSync(`svnadmin create "${repoPath}"`);

    const repoUrl = `file://${repoPath}`;

    // Create initial structure
    const tmpSrcPath = join(tmpBase, 'import-src');

    mkdirSync(tmpSrcPath);
    writeFileSync(join(tmpSrcPath, 'README.txt'), 'Hello SVN\n');

    mkdirSync(join(tmpSrcPath, 'src'));
    writeFileSync(join(tmpSrcPath, 'src', 'main.ts'), 'export const x = 1;\n');

    execSync(`svn import "${tmpSrcPath}" "${repoUrl}/trunk" -m "Initial import" --non-interactive`);

    // Checkout
    execSync(`svn checkout "${repoUrl}/trunk" "${wcPath}" --non-interactive`);

    return {
        repoUrl,
        wcPath,
        cleanup: () => {
            try {
                rmSync(tmpBase, { recursive: true, force: true });
            } catch {
                // ignore cleanup errors
            }
        },
    };
}

/**
  * Commit a file in the working copy with the given content.
  */
export function addAndCommit(
    wcPath: string,
    filename: string,
    content: string,
    message: string
): void {
    const filePath = join(wcPath, filename);
    const dir = filePath.substring(0, filePath.lastIndexOf('/'));
    mkdirSync(dir, { recursive: true });
    writeFileSync(filePath, content);
    execSync(`svn add "${filePath}" --non-interactive 2>/dev/null || true`);
    execSync(`svn commit "${wcPath}" -m "${message}" --non-interactive`);
}
