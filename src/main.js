"use strict";

let Tuning = require("./tuning");
let sysTune = new Tuning();

let Setup = require("./setup");
let s = new Setup(sysTune.getparms());
// After this, the loop runs...


