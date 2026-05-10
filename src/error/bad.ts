import { SvnError } from './base.js';

/** 125xxx - validation / bad input */
export class SvnBadError extends SvnError {
    static readonly svnMin = 125000;
    static readonly svnMax = 130000;
    constructor(c: number, m: string, ch?: SvnError[]) {
        super(c, m, ch);
        this.name = 'SvnBadError';
    }
}
