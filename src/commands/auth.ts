import type { SvnClient } from '../client.js';

export interface AuthOptions {
    remove?: boolean;
    showPasswords?: boolean;
}

export async function auth(
    client: SvnClient,
    patterns?: string[],
    opts?: AuthOptions,
): Promise<string> {
    const args: string[] = [];

    if (opts?.remove) {
        args.push('--remove');
    }

    if (opts?.showPasswords) {
        args.push('--show-passwords');
    }

    if (patterns) {
        args.push(...patterns);
    }

    const result = await client.exec('auth', args);
    return result.stdout;
}
