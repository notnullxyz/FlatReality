
"use strict";

let BaseError = require("./BaseError");

class UnsupportedLightError extends BaseError {
    constructor(msg) {
        super(msg);
    }
}

module.exports = UnsupportedLightError;