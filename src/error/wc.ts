import { SvnError } from './base.js';

/** 155xxx - working copy */
export class SvnWcError extends SvnError {
    static readonly svnMin = 155000;
    static readonly svnMax = 160000;
    constructor(c: number, m: string, ch?: SvnError[]) {
        super(c, m, ch);
        this.name = 'SvnWcError';
    }
}

/** E155000 - Obstructed update (unversioned item blocks versioned path) */
export class SvnObstructedUpdateError extends SvnWcError {
    static readonly svnCode = 155000;
    constructor(m: string, ch?: SvnError[]) {
        super(SvnObstructedUpdateError.svnCode, m, ch);
        this.name = 'SvnObstructedUpdateError';
    }
}

/** E155004 - Directory is already locked by another SVN process */
export class SvnWcLockedError extends SvnWcError {
    static readonly svnCode = 155004;
    constructor(m: string, ch?: SvnError[]) {
        super(SvnWcLockedError.svnCode, m, ch);
        this.name = 'SvnWcLockedError';
    }
}

/** E155007 - Path is not inside a working copy */
export class SvnNotWorkingCopyError extends SvnWcError {
    static readonly svnCode = 155007;
    constructor(m: string, ch?: SvnError[]) {
        super(SvnNotWorkingCopyError.svnCode, m, ch);
        this.name = 'SvnNotWorkingCopyError';
    }
}

/** E155011 - Working copy must be updated before this operation */
export class SvnNotUpToDateError extends SvnWcError {
    static readonly svnCode = 155011;
    constructor(m: string, ch?: SvnError[]) {
        super(SvnNotUpToDateError.svnCode, m, ch);
        this.name = 'SvnNotUpToDateError';
    }
}

/** E155015 - A text or property conflict blocks the operation */
export class SvnConflictError extends SvnWcError {
    static readonly svnCode = 155015;
    constructor(m: string, ch?: SvnError[]) {
        super(SvnConflictError.svnCode, m, ch);
        this.name = 'SvnConflictError';
    }
}

/** E155016 - Working copy metadata is corrupt */
export class SvnWcCorruptError extends SvnWcError {
    static readonly svnCode = 155016;
    constructor(m: string, ch?: SvnError[]) {
        super(SvnWcCorruptError.svnCode, m, ch);
        this.name = 'SvnWcCorruptError';
    }
}

/** E155033 - Working copy directory is missing from disk */
export class SvnWcMissingError extends SvnWcError {
    static readonly svnCode = 155033;
    constructor(m: string, ch?: SvnError[]) {
        super(SvnWcMissingError.svnCode, m, ch);
        this.name = 'SvnWcMissingError';
    }
}

/** E155036 - Working copy must be upgraded to a newer format */
export class SvnUpgradeRequiredError extends SvnWcError {
    static readonly svnCode = 155036;
    constructor(m: string, ch?: SvnError[]) {
        super(SvnUpgradeRequiredError.svnCode, m, ch);
        this.name = 'SvnUpgradeRequiredError';
    }
}

/** E155037 - A previous operation was interrupted; run `svn cleanup` */
export class SvnCleanupRequiredError extends SvnWcError {
    static readonly svnCode = 155037;
    constructor(m: string, ch?: SvnError[]) {
        super(SvnCleanupRequiredError.svnCode, m, ch);
        this.name = 'SvnCleanupRequiredError';
    }
}

/** E155039 - Access to the working copy path was denied by the OS */
export class SvnWcAccessDeniedError extends SvnWcError {
    static readonly svnCode = 155039;
    constructor(m: string, ch?: SvnError[]) {
        super(SvnWcAccessDeniedError.svnCode, m, ch);
        this.name = 'SvnWcAccessDeniedError';
    }
}

/** E155040 - Mixed-revision WC found but the operation requires uniform revisions */
export class SvnMixedRevisionsError extends SvnWcError {
    static readonly svnCode = 155040;
    constructor(m: string, ch?: SvnError[]) {
        super(SvnMixedRevisionsError.svnCode, m, ch);
        this.name = 'SvnMixedRevisionsError';
    }
}
