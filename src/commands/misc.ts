import type { SvnClient } from '../client.js';
import { parseSvnVersion } from '../parse/text.js';
import type { SvnVersion } from '../parse/text.js';

export type { SvnVersion };

export async function help(
    client: SvnClient,
    subcommands?: string[],
): Promise<string> {
    const args: string[] = [];

    if (subcommands) {
        args.push(...subcommands);
    }

    const result = await client.exec('help', args);
    return result.stdout;
}

export async function version(client: SvnClient): Promise<SvnVersion> {
    const result = await client.exec('--version', ['--quiet'], { noGlobalArgs: true });
    return parseSvnVersion(result.stdout);
}
