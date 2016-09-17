"use strict";

let Setup = require("./setup");
let GameLoop = require("./gameloop");

// Create EMPTY WORLD
let s = new Setup();
s.init().then((vitals) => {

    // Run Game Loop

    let loop = new GameLoop(
        vitals.renderer,
        vitals.scene,
        vitals.camera
    );

}).catch((error) => {
    console.log('Deal with error: ' + error);
});




// After this, the loop runs...

