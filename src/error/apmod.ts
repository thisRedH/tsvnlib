import { SvnError } from './base.js';

/** 190xxx - Apache mod_dav_svn */
export class SvnApmodError extends SvnError {
    static readonly svnMin = 190000;
    static readonly svnMax = 195000;
    constructor(c: number, m: string, ch?: SvnError[]) {
        super(c, m, ch);
        this.name = 'SvnApmodError';
    }
}
