/**
  * Text-based (non-XML) output parsers using regex.
  */

export interface SvnVersion {
    version: string;
    major: number;
    minor: number;
    patch: number;
}

/**
  * Extract committed revision from commit / import output.
  * e.g. "Committed revision 42."
  */
export function parseCommitRevision(stdout: string): number {
    const match = stdout.match(/^Committed revision (\d+)\./m);

    if (!match) {
        throw new Error(`Could not parse committed revision from: ${stdout}`);
    }

    return parseInt(match[1], 10);
}

/**
  * Extract revision from update / switch / checkout / export / merge output.
  * e.g. "Updated to revision 42." or "At revision 42." etc.
  */
export function parseUpdateRevision(stdout: string): number {
    const match = stdout.match(/(?:Updated to|At|Checked out|Exported) revision (\d+)\./m);

    if (!match) {
        throw new Error(`Could not parse update revision from: ${stdout}`);
    }

    return parseInt(match[1], 10);
}

/**
  * Parse the output of `svn version` (or --version --quiet).
  */
export function parseSvnVersion(stdout: string): SvnVersion {
    // Match lines like "svn, version 1.14.2 (r1899510)"
    let match = stdout.match(/version (\d+)\.(\d+)\.(\d+)/);

    if (!match) {
        // Simple "1.14.2" format from --version --quiet
        match = stdout.match(/(\d+)\.(\d+)\.(\d+)/);
    }

    if (!match) {
        throw new Error(`Could not parse SVN version from: ${stdout}`);
    }

    return {
        version: `${match[1]}.${match[2]}.${match[3]}`,
        major: parseInt(match[1], 10),
        minor: parseInt(match[2], 10),
        patch: parseInt(match[3], 10),
    };
}
