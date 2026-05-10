import { SvnError } from './base.js';

/** 135xxx - I/O */
export class SvnIoError extends SvnError {
    static readonly svnMin = 135000;
    static readonly svnMax = 140000;
    constructor(c: number, m: string, ch?: SvnError[]) {
        super(c, m, ch);
        this.name = 'SvnIoError';
    }
}
