
"use strict";

/**
 * Custom error base class, support correct custom error name and capture stack trace.
 */
class BaseError extends Error {

    /**
     * Constructor for BaseError.
     * @param {String} message Error message.
     */
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        this.message = message;
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error(message)).stack;
        }
    }
}

module.exports = BaseError;