import { SvnError } from './base.js';

/** 240xxx - X.509 / TLS certificate */
export class SvnX509Error extends SvnError {
    static readonly svnMin = 240000;
    static readonly svnMax = 245000;
    constructor(c: number, m: string, ch?: SvnError[]) {
        super(c, m, ch);
        this.name = 'SvnX509Error';
    }
}
