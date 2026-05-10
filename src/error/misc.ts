import { SvnError } from './base.js';

/** 200xxx - miscellaneous */
export class SvnMiscError extends SvnError {
    static readonly svnMin = 200000;
    static readonly svnMax = 205000;
    constructor(c: number, m: string, ch?: SvnError[]) {
        super(c, m, ch);
        this.name = 'SvnMiscError';
    }
}

/** E200009 - Illegal target (e.g. reserved .svn name) */
export class SvnIllegalTargetError extends SvnMiscError {
    static readonly svnCode = 200009;
    constructor(m: string, ch?: SvnError[]) {
        super(SvnIllegalTargetError.svnCode, m, ch);
        this.name = 'SvnIllegalTargetError';
    }
}

/** E200015 - Operation was cancelled (AbortSignal or Ctrl-C) */
export class SvnCancelledError extends SvnMiscError {
    static readonly svnCode = 200015;
    constructor(m: string, ch?: SvnError[]) {
        super(SvnCancelledError.svnCode, m, ch);
        this.name = 'SvnCancelledError';
    }
}

/** E200017 - Property not found */
export class SvnPropertyNotFoundError extends SvnMiscError {
    static readonly svnCode = 200017;
    constructor(m: string, ch?: SvnError[]) {
        super(SvnPropertyNotFoundError.svnCode, m, ch);
        this.name = 'SvnPropertyNotFoundError';
    }
}
