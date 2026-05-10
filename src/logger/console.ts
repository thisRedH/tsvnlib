import type { Logger } from "./logger.js";

export const consoleLogger: Logger = {
    trace: (msg, ...args) => console.debug(msg, ...args),
    debug: (msg, ...args) => console.debug(msg, ...args),
    info: (msg, ...args) => console.info(msg, ...args),
    warn: (msg, ...args) => console.warn(msg, ...args),
    error: (msg, ...args) => console.error(msg, ...args),
};
