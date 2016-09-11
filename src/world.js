"use strict";

let THREE = require('three');

// Stuff added for devel - will be removed.
let CrateGroup = require('./objects/crate');
let LightBasic = require('./objects/LightBasic');

/**
 * World setup and init.
 */
class World {

    constructor(scene) {
        this.scene = scene;
    }

    /**
     * Setup the initial world. Ground plane, etc.
     * Once in the main render loop, these aspects can change. This is the initial world.
     * @returns {Promise}
     */
    initWorld() {
        console.log('Running initWorld()');

        return new Promise((resolve, reject) => {
            // Ground plane
            var groundGeo = new THREE.PlaneGeometry(3000, 3000, 20, 20);
            var groundMat = new THREE.MeshLambertMaterial(
                {
                    color: 0x604020,
                    overdraw: true
                }
            );
            this.ground = new THREE.Mesh(groundGeo, groundMat);
            this.ground.receiveShadow = true;   // @todo - break out options to Tuning

            // rotate ground plane to proper orientation and add to scene
            this.ground.rotation.x = -90 * Math.PI / 180;

            this.scene.add(this.ground);


            /**
             * HACK IN SOME STUFF FOR NOW
             */
            let crateGroup = new CrateGroup(200);

            // using generator, individual crates:
            //for (let n of crateGroup.generateCrate(80)) {
            //    this.scene.add(n);
            //}
            // using merged groups of crates:
            this.scene.add(crateGroup.generateCrateMeshMergedGroup(80));

            let lightBasic = new LightBasic();
            let directionalLamp = lightBasic.create('directional', 'MainLight');
            this.scene.add(directionalLamp);

            this.scene.fog = new THREE.Fog(0x9db3b5, 0, 1500);  // linear fog

            /**
             * ====== /HACK ====
             */


            return resolve();
        });
    }
}

module.exports = World;
