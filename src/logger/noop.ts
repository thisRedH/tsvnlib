import type { Logger } from "./logger.js";

export const noopLogger: Logger = {
    trace() {},
    debug() {},
    info() {},
    warn() {},
    error() {},
};
