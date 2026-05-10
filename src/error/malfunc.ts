import { SvnError } from './base.js';

/** 235xxx - internal assertion failures */
export class SvnMalfuncError extends SvnError {
    static readonly svnMin = 235000;
    static readonly svnMax = 240000;
    constructor(c: number, m: string, ch?: SvnError[]) {
        super(c, m, ch);
        this.name = 'SvnMalfuncError';
    }
}
