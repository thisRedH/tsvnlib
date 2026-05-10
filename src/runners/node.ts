import { spawn } from 'node:child_process';
import type { Runner, RunOptions, RunResult } from './runner.js';

export const nodeRunner: Runner = (
    executable: string,
    args: string[],
    opts: RunOptions
): Promise<RunResult> => {
    return new Promise<RunResult>((resolve, reject) => {
        const child = spawn(executable, args, {
            env: opts.env,
            cwd: opts.cwd,
            stdio: ['pipe', 'pipe', 'pipe'],
        });

        child.on('error', (err) => {
            reject(err);
        });

        if (opts.signal) {
            function abort() {
                child.kill();
            }

            opts.signal.addEventListener('abort', abort, { once: true });
            child.on('close', () => {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                opts.signal!.removeEventListener('abort', abort); // narrowing lost in callback
            });
        }

        if (opts.stdin != null) {
            const stdinData =
                typeof opts.stdin === 'string'
                    ? Buffer.from(opts.stdin, 'utf8')
                    : Buffer.from(opts.stdin);

            child.stdin.write(stdinData, (err) => {
                if (err) { /* ignore write errors (process may have exited) */ }

                child.stdin.end();
            });
        } else {
            child.stdin.end();
        }

        const stdoutChunks: Uint8Array[] = [];
        child.stdout.on('data', (chunk: Buffer) => {
            const u8 = new Uint8Array(chunk.buffer, chunk.byteOffset, chunk.byteLength);
            stdoutChunks.push(u8);

            if (opts.onStdout) {
                opts.onStdout(u8);
            }
        });

        const stderrChunks: Uint8Array[] = [];
        child.stderr.on('data', (chunk: Buffer) => {
            const u8 = new Uint8Array(chunk.buffer, chunk.byteOffset, chunk.byteLength);
            stderrChunks.push(u8);

            if (opts.onStderr) {
                opts.onStderr(u8);
            }
        });

        child.on('close', (code) => {
            let offset = 0;

            const totalStdoutLen = stdoutChunks.reduce((s, c) => s + c.length, 0);
            const stdout = new Uint8Array(totalStdoutLen);
            offset = 0;
            for (const chunk of stdoutChunks) {
                stdout.set(chunk, offset);
                offset += chunk.length;
            }

            const totalStderrLen = stderrChunks.reduce((s, c) => s + c.length, 0);
            const stderr = new Uint8Array(totalStderrLen);
            offset = 0;
            for (const chunk of stderrChunks) {
                stderr.set(chunk, offset);
                offset += chunk.length;
            }

            resolve({
                stdout,
                stderr,
                exitCode: code ?? 1,
            });
        });
    });
};
