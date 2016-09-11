"use strict";


/**
 * Tuning is (supposed to be) a remote config retriever.
 * Configuration is stored remotely, and downloaded into a local JSON config, which local code can read from.
 */
class Tuning {

    constructor() {
        this.params = {
            name: "testing",
            ver: "1.00"
        };
    }

    getparms() {
        return this.params;
    }

}

module.exports = Tuning;
