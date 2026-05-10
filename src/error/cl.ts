import { SvnError } from './base.js';

/** 205xxx - command-line parsing */
export class SvnClError extends SvnError {
    static readonly svnMin = 205000;
    static readonly svnMax = 210000;
    constructor(c: number, m: string, ch?: SvnError[]) {
        super(c, m, ch);
        this.name = 'SvnClError';
    }
}
