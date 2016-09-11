
"use strict";

let THREE = require("three");

/**
 * Simple light sources for testing and development.
 */
class LightBasic {

    constructor() {
        this.lightSources = new Map();
    }

    /**
     * Factory for creating a light and storing it by name.
     * @param type The type of light (directional, ...)
     * @param name An identifier to reference it with.
     */
    create(type, name) {
        let newLight = undefined;

        if (this.lightSources.has(name)) {
            console.log('existing one found for this id: ' + name);
            newLight = this.lightSources.get(name);
        } else {

            if (type == 'directional') {
                // @todo Most everything here are passable or config/Tuning
                newLight = new THREE.DirectionalLight(0xf6e86d, 0.5);
                newLight.position.set(600, 550, 0);
                newLight.castShadow = true;
                newLight.shadow.mapSize.height = 2048;
                newLight.shadow.mapSize.width = 2048;
                newLight.shadow.camera.far = 3000;
                newLight.shadow.camera.left = -2000;
                newLight.shadow.camera.right = 2000;
                newLight.shadow.camera.top = 1500;
                newLight.shadow.camera.bottom = -1500;

                this.lightSources.set(name, newLight);
            } else {
                console.log('unknown type of light... not creating');
                // create a standard Ambient light
            }
        }

        return newLight;
    }

    /**
     * Remove a lightsource by name.
     * @param name
     */
    remove(name) {
        if (this.lightSources.has(name)) {
            this.lightSources.delete(name);
        }
    }

}

module.exports = LightBasic;
