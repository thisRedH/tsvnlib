import type { RevisionArg } from './types.js';

/**
  * Maps camelCase option names to their SVN flag names.
  * Special short flags are listed here; all others get kebab-cased long flags.
  */
const SHORT_FLAGS: Record<string, string> = {
    revision: '-r',
    quiet: '-q',
    verbose: '-v',
    message: '-m',
    file: '-F',
    extensions: '-x',
    recursive: '-R',
};

/** Convert camelCase to kebab-case */
function toKebab(s: string): string {
    return s.replace(
        /([A-Z])/g,
        (m) => `-${m.toLowerCase()}`,
    );
}

/** Serialize a RevisionArg to string */
export function serializeRevision(rev: RevisionArg): string {
    if (typeof rev === 'number') return String(rev);
    // Template literal like {DATE} or keyword
    return rev;
}

export type BuildArgValue =
    | boolean
    | string
    | number
    | string[]
    | RevisionArg
    | undefined
    | null;

/**
  * Build a flat array of CLI argument strings from an options object.
  *
  * Rules:
  * - boolean true  → --flag-name (or short flag)
  * - boolean false / undefined / null → omitted
  * - string / number → --flag-name VALUE
  * - string[] → --flag-name VALUE repeated per element
  * - RevisionArg (number | template | keyword) → serialized then treated as string
  */
export function buildArgs(opts: Record<string, BuildArgValue>): string[] {
    const result: string[] = [];

    for (const [key, value] of Object.entries(opts)) {
        if (value === undefined || value === null || value === false) {
            continue;
        }

        const flag = SHORT_FLAGS[key] ?? `--${toKebab(key)}`;

        if (value === true) {
            result.push(flag);
        } else if (Array.isArray(value)) {
            for (const item of value) {
                result.push(flag, String(item));
            }
        } else if (typeof value === 'number') {
            // Could be a plain number option (e.g. --limit 10) or revision number
            result.push(flag, String(value));
        } else if (typeof value === 'string') {
            result.push(flag, value);
        }
    }

    return result;
}

/**
  * Serialize a revision argument for use as a -r / --revision value.
  * Handles RevisionRange (string containing ':') as-is.
  */
export function serializeRevisionArg(rev: RevisionArg | string): string {
    if (typeof rev === 'number') {
        return String(rev);
    }

    return rev;
}
