import { SvnError } from './base.js';

/** 215xxx - authentication */
export class SvnAuthnError extends SvnError {
    static readonly svnMin = 215000;
    static readonly svnMax = 220000;
    constructor(c: number, m: string, ch?: SvnError[]) {
        super(c, m, ch);
        this.name = 'SvnAuthnError';
    }
}

/** E215004 - Authentication failed (wrong password, expired credentials, etc.) */
export class SvnAuthenticationFailedError extends SvnAuthnError {
    static readonly svnCode = 215004;
    constructor(m: string, ch?: SvnError[]) {
        super(SvnAuthenticationFailedError.svnCode, m, ch);
        this.name = 'SvnAuthenticationFailedError';
    }
}

/** 220xxx - authorization */
export class SvnAuthzError extends SvnError {
    static readonly svnMin = 220000;
    static readonly svnMax = 225000;
    constructor(c: number, m: string, ch?: SvnError[]) {
        super(c, m, ch);
        this.name = 'SvnAuthzError';
    }
}

/** E220000 - Read access denied for the root of the edit */
export class SvnAuthzRootUnreadableError extends SvnAuthzError {
    static readonly svnCode = 220000;
    constructor(m: string, ch?: SvnError[]) {
        super(SvnAuthzRootUnreadableError.svnCode, m, ch);
        this.name = 'SvnAuthzRootUnreadableError';
    }
}

/** E220001 - Item is not readable (authz policy) */
export class SvnAuthzUnreadableError extends SvnAuthzError {
    static readonly svnCode = 220001;
    constructor(m: string, ch?: SvnError[]) {
        super(SvnAuthzUnreadableError.svnCode, m, ch);
        this.name = 'SvnAuthzUnreadableError';
    }
}

/** E220004 - Item is not writable (authz policy) */
export class SvnAuthzUnwritableError extends SvnAuthzError {
    static readonly svnCode = 220004;
    constructor(m: string, ch?: SvnError[]) {
        super(SvnAuthzUnwritableError.svnCode, m, ch);
        this.name = 'SvnAuthzUnwritableError';
    }
}
