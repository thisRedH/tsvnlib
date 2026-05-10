export { SvnError, SvnProcessError } from './base.js';
export { SvnBadError } from './bad.js';
export { SvnXmlError } from './xml.js';
export { SvnIoError } from './io.js';
export { SvnStreamError } from './stream.js';
export { SvnNodeError } from './node.js';
export { SvnEntryError } from './entry.js';
export {
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
export {
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
export { SvnReposError, SvnReposLockedError, SvnHookFailureError } from './repos.js';
export {
    SvnRaError,
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
export { SvnDiffFormatError } from './diff-format.js';
export { SvnApmodError } from './apmod.js';
export {
    SvnClientError,
    SvnIsBinaryFileError,
    SvnClientModifiedError,
    SvnForbiddenByServerError,
} from './client.js';
export {
    SvnMiscError,
    SvnIllegalTargetError,
    SvnCancelledError,
    SvnPropertyNotFoundError,
} from './misc.js';
export { SvnClError } from './cl.js';
export {
    SvnAuthnError,
    SvnAuthenticationFailedError,
    SvnAuthzError,
    SvnAuthzRootUnreadableError,
    SvnAuthzUnreadableError,
    SvnAuthzUnwritableError,
} from './auth.js';
export { SvnDiffError } from './diff.js';
export { SvnMalfuncError } from './malfunc.js';
export { SvnX509Error } from './x509.js';
export { parseSvnStderr, parseSvnWarnings } from './parse.js';
