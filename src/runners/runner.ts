export interface RunResult {
    stdout: Uint8Array;
    stderr: Uint8Array;
    exitCode: number;
}

export interface RunOptions {
    stdin?: Uint8Array | string;
    env?: Record<string, string>;
    cwd?: string;
    onStdout?: (chunk: Uint8Array) => void;
    onStderr?: (chunk: Uint8Array) => void;
    signal?: AbortSignal;
}

export type Runner = (
    executable: string,
    args: string[],
    opts: RunOptions,
) => Promise<RunResult>;
