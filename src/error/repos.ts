import { SvnError } from './base.js';

/** 165xxx - repository operations */
export class SvnReposError extends SvnError {
    static readonly svnMin = 165000;
    static readonly svnMax = 170000;
    constructor(c: number, m: string, ch?: SvnError[]) {
        super(c, m, ch);
        this.name = 'SvnReposError';
    }
}

/** E165000 - Repository is locked (e.g. during hotcopy or recovery) */
export class SvnReposLockedError extends SvnReposError {
    static readonly svnCode = 165000;
    constructor(m: string, ch?: SvnError[]) {
        super(SvnReposLockedError.svnCode, m, ch);
        this.name = 'SvnReposLockedError';
    }
}

/** E165001 - A pre-commit, pre-lock, or other hook returned a failure */
export class SvnHookFailureError extends SvnReposError {
    static readonly svnCode = 165001;
    constructor(m: string, ch?: SvnError[]) {
        super(SvnHookFailureError.svnCode, m, ch);
        this.name = 'SvnHookFailureError';
    }
}
