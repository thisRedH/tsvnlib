import { SvnError } from './base.js';

/** 160xxx - repository filesystem */
export class SvnFsError extends SvnError {
    static readonly svnMin = 160000;
    static readonly svnMax = 165000;
    constructor(c: number, m: string, ch?: SvnError[]) {
        super(c, m, ch);
        this.name = 'SvnFsError';
    }
}

/** E160004 - Repository filesystem is corrupt */
export class SvnFsCorruptError extends SvnFsError {
    static readonly svnCode = 160004;
    constructor(m: string, ch?: SvnError[]) {
        super(SvnFsCorruptError.svnCode, m, ch);
        this.name = 'SvnFsCorruptError';
    }
}

/** E160006 - Revision does not exist in the repository */
export class SvnNoSuchRevisionError extends SvnFsError {
    static readonly svnCode = 160006;
    constructor(m: string, ch?: SvnError[]) {
        super(SvnNoSuchRevisionError.svnCode, m, ch);
        this.name = 'SvnNoSuchRevisionError';
    }
}

/** E160013 - Item not found in the repository at the given path/revision */
export class SvnNotFoundError extends SvnFsError {
    static readonly svnCode = 160013;
    constructor(m: string, ch?: SvnError[]) {
        super(SvnNotFoundError.svnCode, m, ch);
        this.name = 'SvnNotFoundError';
    }
}

/** E160020 - Item already exists at the target path */
export class SvnAlreadyExistsError extends SvnFsError {
    static readonly svnCode = 160020;
    constructor(m: string, ch?: SvnError[]) {
        super(SvnAlreadyExistsError.svnCode, m, ch);
        this.name = 'SvnAlreadyExistsError';
    }
}

/** E160024 - Merge conflict detected during commit */
export class SvnFsConflictError extends SvnFsError {
    static readonly svnCode = 160024;
    constructor(m: string, ch?: SvnError[]) {
        super(SvnFsConflictError.svnCode, m, ch);
        this.name = 'SvnFsConflictError';
    }
}

/** E160035 - Path is already locked by another user/token */
export class SvnPathAlreadyLockedError extends SvnFsError {
    static readonly svnCode = 160035;
    constructor(m: string, ch?: SvnError[]) {
        super(SvnPathAlreadyLockedError.svnCode, m, ch);
        this.name = 'SvnPathAlreadyLockedError';
    }
}

/** E160036 - Path is not locked (but expected to be) */
export class SvnPathNotLockedError extends SvnFsError {
    static readonly svnCode = 160036;
    constructor(m: string, ch?: SvnError[]) {
        super(SvnPathNotLockedError.svnCode, m, ch);
        this.name = 'SvnPathNotLockedError';
    }
}

/** E160039 - Lock owner does not match the current user */
export class SvnLockOwnerMismatchError extends SvnFsError {
    static readonly svnCode = 160039;
    constructor(m: string, ch?: SvnError[]) {
        super(SvnLockOwnerMismatchError.svnCode, m, ch);
        this.name = 'SvnLockOwnerMismatchError';
    }
}

/** E160041 - Lock has expired */
export class SvnLockExpiredError extends SvnFsError {
    static readonly svnCode = 160041;
    constructor(m: string, ch?: SvnError[]) {
        super(SvnLockExpiredError.svnCode, m, ch);
        this.name = 'SvnLockExpiredError';
    }
}

/** E160042 - Item in the repository is newer than the working copy */
export class SvnOutOfDateError extends SvnFsError {
    static readonly svnCode = 160042;
    constructor(m: string, ch?: SvnError[]) {
        super(SvnOutOfDateError.svnCode, m, ch);
        this.name = 'SvnOutOfDateError';
    }
}
