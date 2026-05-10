import { SvnError } from './base.js';

/** 145xxx - node kind */
export class SvnNodeError extends SvnError {
    static readonly svnMin = 145000;
    static readonly svnMax = 150000;
    constructor(c: number, m: string, ch?: SvnError[]) {
        super(c, m, ch);
        this.name = 'SvnNodeError';
    }
}
