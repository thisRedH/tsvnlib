import { SvnError } from './base.js';

/** 140xxx - streams */
export class SvnStreamError extends SvnError {
    static readonly svnMin = 140000;
    static readonly svnMax = 145000;
    constructor(c: number, m: string, ch?: SvnError[]) {
        super(c, m, ch);
        this.name = 'SvnStreamError';
    }
}
