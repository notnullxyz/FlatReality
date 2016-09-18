"use strict";

let Setup = require("./setup");
let GameLoop = require("./gameloop");

function stat() {
    var script=document.createElement('script');
    script.onload=function() {
        var stats=new Stats();
        document.body.appendChild(stats.dom);
        requestAnimationFrame( function loop() {
            stats.update();
            requestAnimationFrame(loop)
        });
    };
    script.src='//rawgit.com/mrdoob/stats.js/master/build/stats.min.js';
    document.head.appendChild(script);
}

stat();


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

