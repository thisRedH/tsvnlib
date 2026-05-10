import { SvnError } from './base.js';

/** 130xxx - XML parsing */
export class SvnXmlError extends SvnError {
    static readonly svnMin = 130000;
    static readonly svnMax = 135000;
    constructor(c: number, m: string, ch?: SvnError[]) {
        super(c, m, ch);
        this.name = 'SvnXmlError';
    }
}
