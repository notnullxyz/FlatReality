"use strict";

//
// This is the main entry point. Keep clean at all costs!
// @author Marlon van der Linde <marlon@notnull.xyz>
//

// Two important parts, the initial setup, and the render loop!
let Setup = require("./setup");
let GameLoop = require("./gameloop");

// MrDoob's stats lib for the performance metrics in the corner :-)
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

// Create empty world, then on promise fulfilment, kick off GameLoop.
let s = new Setup();
s.init().then((vitals) => {

    // Run Game Loop

    let loop = new GameLoop(
        vitals.renderer,
        vitals.scene,
        vitals.camera
    );

}).catch((error) => {
    // Error Handler and exception recovery... coming soon.
    console.log('Deal with error: ' + error);
});
