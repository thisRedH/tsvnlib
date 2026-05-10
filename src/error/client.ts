import { SvnError } from './base.js';

/** 195xxx - high-level client operations */
export class SvnClientError extends SvnError {
    static readonly svnMin = 195000;
    static readonly svnMax = 200000;
    constructor(c: number, m: string, ch?: SvnError[]) {
        super(c, m, ch);
        this.name = 'SvnClientError';
    }
}

/** E195004 - Tried to operate on a file with svn:mime-type = binary */
export class SvnIsBinaryFileError extends SvnClientError {
    static readonly svnCode = 195004;
    constructor(m: string, ch?: SvnError[]) {
        super(SvnIsBinaryFileError.svnCode, m, ch);
        this.name = 'SvnIsBinaryFileError';
    }
}

/** E195006 - Attempted restricted operation for modified resource */
export class SvnClientModifiedError extends SvnClientError {
    static readonly svnCode = 195006;
    constructor(m: string, ch?: SvnError[]) {
        super(SvnClientModifiedError.svnCode, m, ch);
        this.name = 'SvnClientModifiedError';
    }
}

/** E195023 - Operation forbidden by server policy */
export class SvnForbiddenByServerError extends SvnClientError {
    static readonly svnCode = 195023;
    constructor(m: string, ch?: SvnError[]) {
        super(SvnForbiddenByServerError.svnCode, m, ch);
        this.name = 'SvnForbiddenByServerError';
    }
}
