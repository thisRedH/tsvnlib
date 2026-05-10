import { SvnError } from './base.js';

/** 225xxx - diff/merge data */
export class SvnDiffError extends SvnError {
    static readonly svnMin = 225000;
    static readonly svnMax = 230000;
    constructor(c: number, m: string, ch?: SvnError[]) {
        super(c, m, ch);
        this.name = 'SvnDiffError';
    }
}
