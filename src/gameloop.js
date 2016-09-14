"use strict";

let THREE = require('three');

let controlsG;

/**
 * This class aims to be as empty and as basic as possible, this is the GAME LOOP!
 */
class GameLoop {

    /**
     * Construction sets off the loop. Do not construct until ready!
     */
    constructor(renderer, scene, camera, controls) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        controlsG = controls;
        this.loop();
    }

    /**
     * This is it...
     */
    loop() {

        /**
         * This is the only way I can get es6 arrow operator + recursive function to work :|
         */
        var animate = () => {
            this.renderer.render(this.scene, this.camera);

            /**
             * Added call outs...
             */
            controlsG.updateControls(controlsG.get());     // call controls update.

            requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
    }


}

module.exports = GameLoop;
