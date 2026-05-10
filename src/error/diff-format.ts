import { SvnError } from './base.js';

/** 185xxx - svndiff binary format */
export class SvnDiffFormatError extends SvnError {
    static readonly svnMin = 185000;
    static readonly svnMax = 190000;
    constructor(c: number, m: string, ch?: SvnError[]) {
        super(c, m, ch);
        this.name = 'SvnDiffFormatError';
    }
}
