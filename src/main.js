"use strict";


let Setup = require("./setup");
let GameLoop = require("./gameloop");
let PLControls = require("./PLControls");

// Create EMPTY WORLD
let s = new Setup();
s.init().then((vitals) => {

    let plControls = new PLControls(vitals.camera);

    // Run Game Loop

    let loop = new GameLoop(
        vitals.renderer,
        vitals.scene,
        vitals.camera,
        plControls
    );

    vitals = undefined;

}).catch((error) => {
    console.log('Deal with error: ' + error);
});

// After this, the loop runs...
