import { SvnError } from './base.js';

export class SvnRaError extends SvnError { }

/** 170xxx - repository access (generic) */
export class SvnRaGenericError extends SvnRaError {
    static readonly svnMin = 170000;
    static readonly svnMax = 175000;
    constructor(c: number, m: string, ch?: SvnError[]) {
        super(c, m, ch);
        this.name = 'SvnRaGenericError';
    }
}

/** E170001 - Authorization failed at the RA layer */
export class SvnRaNotAuthorizedError extends SvnRaGenericError {
    static readonly svnCode = 170001;
    constructor(m: string, ch?: SvnError[]) {
        super(SvnRaNotAuthorizedError.svnCode, m, ch);
        this.name = 'SvnRaNotAuthorizedError';
    }
}

/** E170004 - Remote item is out of date */
export class SvnRaOutOfDateError extends SvnRaGenericError {
    static readonly svnCode = 170004;
    constructor(m: string, ch?: SvnError[]) {
        super(SvnRaOutOfDateError.svnCode, m, ch);
        this.name = 'SvnRaOutOfDateError';
    }
}

/** E170009 - Repository UUID in WC does not match the server */
export class SvnUuidMismatchError extends SvnRaGenericError {
    static readonly svnCode = 170009;
    constructor(m: string, ch?: SvnError[]) {
        super(SvnUuidMismatchError.svnCode, m, ch);
        this.name = 'SvnUuidMismatchError';
    }
}

/** E170013 - Session could not be created (bad URL, network down) */
export class SvnCannotCreateSessionError extends SvnRaGenericError {
    static readonly svnCode = 170013;
    constructor(m: string, ch?: SvnError[]) {
        super(SvnCannotCreateSessionError.svnCode, m, ch);
        this.name = 'SvnCannotCreateSessionError';
    }
}

/** 175xxx - WebDAV/HTTP RA */
export class SvnRaDavError extends SvnRaError {
    static readonly svnMin = 175000;
    static readonly svnMax = 180000;
    constructor(c: number, m: string, ch?: SvnError[]) {
        super(c, m, ch);
        this.name = 'SvnRaDavError';
    }
}

/** E175002 - Generic HTTP request failure (check message for HTTP status) */
export class SvnDavRequestFailedError extends SvnRaDavError {
    static readonly svnCode = 175002;
    constructor(m: string, ch?: SvnError[]) {
        super(SvnDavRequestFailedError.svnCode, m, ch);
        this.name = 'SvnDavRequestFailedError';
    }
}

/** E175011 - Repository has been moved; update the URL */
export class SvnDavRelocatedError extends SvnRaDavError {
    static readonly svnCode = 175011;
    constructor(m: string, ch?: SvnError[]) {
        super(SvnDavRelocatedError.svnCode, m, ch);
        this.name = 'SvnDavRelocatedError';
    }
}

/** E175012 - HTTP connection timed out */
export class SvnDavConnTimeoutError extends SvnRaDavError {
    static readonly svnCode = 175012;
    constructor(m: string, ch?: SvnError[]) {
        super(SvnDavConnTimeoutError.svnCode, m, ch);
        this.name = 'SvnDavConnTimeoutError';
    }
}

/** E175013 - URL access forbidden (403) */
export class SvnDavForbiddenError extends SvnRaDavError {
    static readonly svnCode = 175013;
    constructor(m: string, ch?: SvnError[]) {
        super(SvnDavForbiddenError.svnCode, m, ch);
        this.name = 'SvnDavForbiddenError';
    }
}

/** 180xxx - local RA (file://) */
export class SvnRaLocalError extends SvnRaError {
    static readonly svnMin = 180000;
    static readonly svnMax = 185000;
    constructor(c: number, m: string, ch?: SvnError[]) {
        super(c, m, ch);
        this.name = 'SvnRaLocalError';
    }
}

/** 210xxx - svn:// protocol */
export class SvnRaSvnError extends SvnRaError {
    static readonly svnMin = 210000;
    static readonly svnMax = 215000;
    constructor(c: number, m: string, ch?: SvnError[]) {
        super(c, m, ch);
        this.name = 'SvnRaSvnError';
    }
}

/** 230xxx - serf HTTP client */
export class SvnRaSerfError extends SvnRaError {
    static readonly svnMin = 230000;
    static readonly svnMax = 235000;
    constructor(c: number, m: string, ch?: SvnError[]) {
        super(c, m, ch);
        this.name = 'SvnRaSerfError';
    }
}
