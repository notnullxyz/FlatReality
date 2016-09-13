"use strict";


let Setup = require("./setup");
let GameLoop = require("./gameloop");
let Input = require("./input");

// Create EMPTY WORLD
let s = new Setup();
s.init().then((vitals) => {

    // @todo unset `Setup` and `s`
    // Run Game Loop
    let controls = new Input(vitals.camera);
    let loop = new GameLoop(
        vitals.renderer,
        vitals.scene,
        vitals.camera,
        controls.get()
    );

    // @todo unset `vitals`

}).catch((error) => {
    console.log('Deal with error: ' + error);
});

// After this, the loop runs...
