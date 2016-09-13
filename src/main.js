"use strict";


let Setup = require("./setup");
let GameLoop = require("./gameloop");
let PLControls = require("./input");

// Create EMPTY WORLD
let s = new Setup();
s.init().then((vitals) => {

    let controls = new PLControls(vitals.camera);

    // Run Game Loop

    let loop = new GameLoop(
        vitals.renderer,
        vitals.scene,
        vitals.camera,
        controls.get()
    );

    vitals = undefined;

}).catch((error) => {
    console.log('Deal with error: ' + error);
});

// After this, the loop runs...
