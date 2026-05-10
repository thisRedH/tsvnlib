import { SvnError } from './base.js';
import { SvnBadError } from './bad.js';
import { SvnXmlError } from './xml.js';
import { SvnIoError } from './io.js';
import { SvnStreamError } from './stream.js';
import { SvnNodeError } from './node.js';
import { SvnEntryError } from './entry.js';
import {
    SvnWcError,
    SvnObstructedUpdateError,
    SvnWcLockedError,
    SvnNotWorkingCopyError,
    SvnNotUpToDateError,
    SvnConflictError,
    SvnWcCorruptError,
    SvnWcMissingError,
    SvnUpgradeRequiredError,
    SvnCleanupRequiredError,
    SvnWcAccessDeniedError,
    SvnMixedRevisionsError,
} from './wc.js';
import {
    SvnFsError,
    SvnFsCorruptError,
    SvnNoSuchRevisionError,
    SvnNotFoundError,
    SvnAlreadyExistsError,
    SvnFsConflictError,
    SvnPathAlreadyLockedError,
    SvnPathNotLockedError,
    SvnLockOwnerMismatchError,
    SvnLockExpiredError,
    SvnOutOfDateError,
} from './fs.js';
import { SvnReposError, SvnReposLockedError, SvnHookFailureError } from './repos.js';
import {
    SvnRaGenericError,
    SvnRaNotAuthorizedError,
    SvnRaOutOfDateError,
    SvnUuidMismatchError,
    SvnCannotCreateSessionError,
    SvnRaDavError,
    SvnDavRequestFailedError,
    SvnDavRelocatedError,
    SvnDavConnTimeoutError,
    SvnDavForbiddenError,
    SvnRaLocalError,
    SvnRaSvnError,
    SvnRaSerfError,
} from './ra.js';
import { SvnDiffFormatError } from './diff-format.js';
import { SvnApmodError } from './apmod.js';
import {
    SvnClientError,
    SvnIsBinaryFileError,
    SvnClientModifiedError,
    SvnForbiddenByServerError,
} from './client.js';
import {
    SvnMiscError,
    SvnIllegalTargetError,
    SvnCancelledError,
    SvnPropertyNotFoundError,
} from './misc.js';
import { SvnClError } from './cl.js';
import {
    SvnAuthnError,
    SvnAuthenticationFailedError,
    SvnAuthzError,
    SvnAuthzRootUnreadableError,
    SvnAuthzUnreadableError,
    SvnAuthzUnwritableError,
} from './auth.js';
import { SvnDiffError } from './diff.js';
import { SvnMalfuncError } from './malfunc.js';
import { SvnX509Error } from './x509.js';

type SpecificCtor = (new (m: string, ch?: SvnError[]) => SvnError) & { readonly svnCode: number };

/** Maps a specific error code to its named class. Single source of truth - codes live only on the classes. */
const SPECIFIC_ERRORS = new Map<number, SpecificCtor>(
    ([
        // WC
        SvnObstructedUpdateError,
        SvnWcLockedError,
        SvnNotWorkingCopyError,
        SvnNotUpToDateError,
        SvnConflictError,
        SvnWcCorruptError,
        SvnWcMissingError,
        SvnUpgradeRequiredError,
        SvnCleanupRequiredError,
        SvnWcAccessDeniedError,
        SvnMixedRevisionsError,
        // FS
        SvnFsCorruptError,
        SvnNoSuchRevisionError,
        SvnNotFoundError,
        SvnAlreadyExistsError,
        SvnFsConflictError,
        SvnPathAlreadyLockedError,
        SvnPathNotLockedError,
        SvnLockOwnerMismatchError,
        SvnLockExpiredError,
        SvnOutOfDateError,
        // REPOS
        SvnReposLockedError,
        SvnHookFailureError,
        // RA
        SvnRaNotAuthorizedError,
        SvnRaOutOfDateError,
        SvnUuidMismatchError,
        SvnCannotCreateSessionError,
        // RA_DAV
        SvnDavRequestFailedError,
        SvnDavRelocatedError,
        SvnDavConnTimeoutError,
        SvnDavForbiddenError,
        // CLIENT
        SvnIsBinaryFileError,
        SvnClientModifiedError,
        SvnForbiddenByServerError,
        // MISC
        SvnIllegalTargetError,
        SvnCancelledError,
        SvnPropertyNotFoundError,
        // AUTHN
        SvnAuthenticationFailedError,
        // AUTHZ
        SvnAuthzRootUnreadableError,
        SvnAuthzUnreadableError,
        SvnAuthzUnwritableError,
    ] as SpecificCtor[]).map(C => [C.svnCode, C])
);

type CategoryCtor = (new (c: number, m: string, ch?: SvnError[]) => SvnError) & { readonly svnMin: number; readonly svnMax: number };

/** Category classes in range order. Ranges live on the classes as svnMin/svnMax. */
const CATEGORY_ERRORS: ReadonlyArray<CategoryCtor> = [
    SvnBadError,
    SvnXmlError,
    SvnIoError,
    SvnStreamError,
    SvnNodeError,
    SvnEntryError,
    SvnWcError,
    SvnFsError,
    SvnReposError,
    SvnRaGenericError,
    SvnRaDavError,
    SvnRaLocalError,
    SvnDiffFormatError,
    SvnApmodError,
    SvnClientError,
    SvnMiscError,
    SvnClError,
    SvnRaSvnError,
    SvnAuthnError,
    SvnAuthzError,
    SvnDiffError,
    SvnRaSerfError,
    SvnMalfuncError,
    SvnX509Error,
];

/**
 * Parse SVN stderr into a typed SvnError (possibly with a chain), or
 * return null if no recognisable error line was found.
 *
 * SVN writes one line per error / per chain link:
 *   svn: E155007: Path is not a working copy directory
 *   svn: E155007: /home/user/foo          <- same code, location detail
 *
 * The first line is the outermost error; subsequent lines form the chain
 * in the order SVN printed them.
 */
export function parseSvnStderr(stderr: string): SvnError | null {
    const pattern = /^svn: E(\d{6}): (.+)$/gm;
    const lines: Array<{ code: number; message: string }> = [];

    let m: RegExpExecArray | null;
    while ((m = pattern.exec(stderr)) !== null) {
        lines.push({ code: parseInt(m[1], 10), message: m[2] });
    }

    if (lines.length === 0) {
        return null;
    }

    const chain: SvnError[] = lines
        .slice(1)
        .map(l => makeSvnError(l.code, l.message, []));

    return makeSvnError(lines[0].code, lines[0].message, chain);
}

/** Parse SVN warning lines from stderr (non-fatal). */
export function parseSvnWarnings(stderr: string): Array<{ code: number; message: string }> {
    const pattern = /^svn: warning: W(\d{6}): (.+)$/gm;
    const result: Array<{ code: number; message: string }> = [];

    let m: RegExpExecArray | null;
    while ((m = pattern.exec(stderr)) !== null) {
        result.push({ code: parseInt(m[1], 10), message: m[2] });
    }

    return result;
}

/** Instantiate the most specific subclass for a given numeric SVN error code. */
function makeSvnError(code: number, message: string, chain: SvnError[]): SvnError {
    const Specific = SPECIFIC_ERRORS.get(code);
    if (Specific) {
        return new Specific(message, chain);
    }

    const Category = CATEGORY_ERRORS.find(C => code >= C.svnMin && code < C.svnMax);
    if (Category) {
        return new Category(code, message, chain);
    }

    return new SvnError(code, message, chain);
}
