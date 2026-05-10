/**
 * An error reported by the `svn` process via stderr.
 * `code` is the 6-digit SVN error number (e.g. 155007).
 * `chain` holds inner errors in the order SVN printed them.
 */
export class SvnError extends Error {
    readonly code: number;
    readonly svnMessage: string;
    readonly chain: SvnError[];

    constructor(code: number, svnMessage: string, chain: SvnError[] = []) {
        super(`E${String(code).padStart(6, '0')}: ${svnMessage}`);
        this.name = 'SvnError';
        this.code = code;
        this.svnMessage = svnMessage;
        this.chain = chain;
        Object.setPrototypeOf(this, new.target.prototype);
    }

    /** True if this error or any error in the chain has the given code. */
    hasCode(code: number): boolean {
        return this.code === code || this.chain.some(e => e.hasCode(code));
    }
}

/**
 * SVN exited with a non-zero code but stderr contained no recognisable
 * `svn: EXXXXXX:` line (e.g. crash, signal, unexpected output).
 */
export class SvnProcessError extends Error {
    readonly exitCode: number;
    readonly stderr: string;

    constructor(exitCode: number, stderr: string) {
        super(`svn process exited with code ${exitCode}`);
        this.name = 'SvnProcessError';
        this.exitCode = exitCode;
        this.stderr = stderr;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
