import { describe, it, expect } from 'vitest';
import { SvnClient } from '../../src/index.js';
import { nodeRunner } from '../../src/runners/node.js';

/**
  * Remote auth tests - skipped unless SVN_TEST_REMOTE_URL is set in the environment.
  *
  * To run these tests:
  *   SVN_TEST_REMOTE_URL=https://svn.example.com/repos \
  *   SVN_TEST_USERNAME=user \
  *   SVN_TEST_PASSWORD=pass \
  *   npm run test:integration
  */

const remoteUrl = process.env.SVN_TEST_REMOTE_URL;
const testUsername = process.env.SVN_TEST_USERNAME;
const testPassword = process.env.SVN_TEST_PASSWORD;

const skipIfNoRemote = !remoteUrl;

describe.skipIf(skipIfNoRemote)('auth (remote integration)', () => {
    it('can list the remote repository without auth credentials when no auth required', async () => {
        const client = new SvnClient(nodeRunner, {
            repoUrl: remoteUrl,
            nonInteractive: true,
            noAuthCache: true,
        });

        // Should not throw if the repo is publicly accessible
        const entries = await client.list([remoteUrl!]);
        expect(entries).toBeInstanceOf(Map);
    });

    it.skipIf(!testUsername || !testPassword)(
        'authenticates successfully with username/password',
        async () => {
            const client = new SvnClient(nodeRunner, {
                repoUrl: remoteUrl,
                username: testUsername,
                password: testPassword,
                nonInteractive: true,
                noAuthCache: true,
            });

            const entries = await client.list([remoteUrl!]);
            expect(entries).toBeInstanceOf(Map);
        }
    );

    it.skipIf(!testUsername || !testPassword)(
        'rejects invalid credentials',
        async () => {
            const client = new SvnClient(nodeRunner, {
                repoUrl: remoteUrl,
                username: 'invalid-user-xyz',
                password: 'invalid-password-xyz',
                nonInteractive: true,
                noAuthCache: true,
            });

            // Expect an SvnError when credentials are wrong
            await expect(client.list([remoteUrl!])).rejects.toThrow();
        }
    );

    it.skipIf(!testUsername || !testPassword)(
        'info command returns entries for authenticated user',
        async () => {
            const client = new SvnClient(nodeRunner, {
                repoUrl: remoteUrl,
                username: testUsername,
                password: testPassword,
                nonInteractive: true,
                noAuthCache: true,
            });

            const entries = await client.info([remoteUrl!]);
            expect(entries).toBeInstanceOf(Array);
            expect(entries.length).toBeGreaterThan(0);
        }
    );
});
