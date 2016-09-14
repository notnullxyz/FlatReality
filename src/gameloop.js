"use strict";

let THREE = require("three");
let ctrlib = require("./controls/ctrlib");

/**
 * This class aims to be as empty and as basic as possible, this is the GAME LOOP!
 */
class GameLoop {

    /**
     * Construction sets off the loop. Do not construct until ready!
     */
    constructor(renderer, scene, camera) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;

        ctrlib.initControls();
        ctrlib.initPointerLock(camera);
        let controls = ctrlib.getControls();
        this.scene.add(controls);

        // ()()() Start the loop ()()()
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

            ctrlib.updateControls();

            requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
    }

}

module.exports = GameLoop;
