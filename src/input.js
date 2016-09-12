"use strict";

let THREE = require("three");

const DEFAULT_MOVE_SPEED = 100;
const DEFAULT_LOOK_SPEED = 0.1;

class InputControls {

    /**
     * Constructor for InputControls.
     * @param camera Camera object to move with.
     * @param config Configuration objects relating controls and movement.
     */
    constructor(camera, config = {}) {
        this.config = config;
        THREE.FirstPersonControls(camera);
        //this.controls = new FPSControls(camera);
        this.controls.movementSpeed = this.config.movementSpeed || DEFAULT_MOVE_SPEED;
        this.controls.lookSpeed = this.config.lookSpeed || DEFAULT_LOOK_SPEED;
    }

    /**
     * Returns the controls object
     * @returns {THREE.FirstPersonControls}
     */
    get() {
        return this.controls;
    }

}

module.exports = InputControls;