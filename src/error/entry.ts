import { SvnError } from './base.js';

/** 150xxx - directory entry */
export class SvnEntryError extends SvnError {
    static readonly svnMin = 150000;
    static readonly svnMax = 155000;
    constructor(c: number, m: string, ch?: SvnError[]) {
        super(c, m, ch);
        this.name = 'SvnEntryError';
    }
}
