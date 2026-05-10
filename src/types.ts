export type RevisionArg =
    | number
    | `{${string}}`  // '{' DATE '}'
    | 'HEAD'
    | 'BASE'
    | 'COMMITTED'
    | 'PREV';

export type RevisionRange = `${RevisionArg}:${RevisionArg}`;

export type Depth = 'empty' | 'files' | 'immediates' | 'infinity';

export type SetDepth = 'exclude' | 'empty' | 'files' | 'immediates' | 'infinity';

export type AcceptAction =
    | 'postpone'
    | 'p'
    | 'working'
    | 'base'
    | 'mine-conflict'
    | 'mc'
    | 'theirs-conflict'
    | 'tc'
    | 'mine-full'
    | 'mf'
    | 'theirs-full'
    | 'tf'
    | 'edit'
    | 'e'
    | 'launch'
    | 'l'
    | 'recommended'
    | 'r';

export interface GlobalOptions {
    username?: string;
    /** Visible in process arguments (e.g. `ps`). Prefer `passwordFromStdin` when secrecy matters. */
    password?: string;
    passwordFromStdin?: boolean;
    noAuthCache?: boolean;
    nonInteractive?: boolean;
    forceInteractive?: boolean;
    trustServerCertFailures?: Array<'unknown-ca' | 'cn-mismatch' | 'expired' | 'not-yet-valid' | 'other'>;
    configDir?: string;
    configOption?: string;
}
