"use strict";

let THREE = require("three");

const UnsupportedLightError = require("../../errors/UnsupportedLightError");

/**
 * FlatReality Light factory.
 * Creates simple, default lights, configurable to a certain degree, leaving the caller with the option of controlling
 * other usual aspects from the there onwards. This was created for development purposes, but can be used for any
 * light creation nevertheless.
 * @author Marlon van der Linde <marlon@notnull.xyz>
 */
class LightFactory {

    constructor() {
    }

    /**
     * Creates a light of type n, and returns an instance of it.
     * Any specifics are left to the user of this method (penumbra, decay, whatever is relevant to the light type).
     * Also remember to update updateMatrixWorld() if targetObject is specified, and when target object moves.
     *
     * @param {String} type The type of light to create.
     * @param {Number} color Optional. Hex colro value of the light. Defaults to 0x404040 (soft white)
     * @param {Number} intensity Optional. Light intensity (0-1), defaults to 0.8
     * @param {Boolean} castShadows Optional. Enables shadow casting for this light.
     * @param {Number} shadowMap Optional. Shadow map size applied to width and height. Default 2048
     * @param {Number} distance Optional. For some lights, this is the distance at which intensity falls to zero.
     * @param {Object3D} targetObject Optional. The target object for this light.
     * @returns {Light} THREE.Light
     */
    static create(type,
                  color = 0x404040,
                  intensity = 0.9,
                  castShadows = true,
                  shadowMapSize = 2048,
                  distance = 200,
                  targetObj = undefined) {

        console.log('LightFactory.create() --');

        let light = undefined;

        switch (type) {
            case 'ambient':
                light = new THREE.AmbientLight(color, intensity);
                break;

            case 'directional':
                light = new THREE.DirectionalLight(color, intensity);
                light.castShadow = castShadows;
                light.shadow.mapSize.width = light.shadow.mapSize.height = shadowMapSize;

                if (targetObj) {
                    light.target = targetObj;
                }
                break;

            case 'spot':
                light = new THREE.SpotLight(color, intensity, distance);
                light.castShadow = castShadows;
                light.shadow.mapSize.width = light.shadow.mapSize.height = shadowMapSize;

                if (targetObj) {
                    light.target = targetObj;
                }
                break;

            case 'point':
                light = new THREE.PointLight(color, intensity, distance);

                // iirc, pointlights can now do shadows?
                light.castShadow = castShadows;
                light.shadow.mapSize.width = light.shadow.mapSize.height = shadowMapSize;
                break;

            // Not implementing Hemisphere Light. Complicated with two colors, best left to user.

            default:
                throw new UnsupportedLightError('LightFactory does not yet support light type: ', type);
        }

        return light;
    }

}

module.exports = LightFactory;
