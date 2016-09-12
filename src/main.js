"use strict";

// Create EMPTY WORLD
let Setup = require("./setup");
let s = new Setup();
s.init().then((vitals) => {

    console.log(vitals);

    // @todo unset `Setup` and `s`

    // Run Game Loop
    let GameLoop = require("./gameloop");
    let loop = new GameLoop(vitals.renderer, vitals.scene, vitals.camera);

    // @todo unset `vitals`

}).catch((error) => {
    console.log('Deal with error: ' + error);
});

// After this, the loop runs...
