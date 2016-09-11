"use strict";

let THREE = require('three');

let CrateGroup = require('./objects/crate');

const RENDERER = "webgl";   // or 'canvas' or ...

class Setup {

    constructor(tuningParams) {
        this.tuningParams = tuningParams;
        this.preinit().then(() => {
            this.init();
        }).catch(() => {
            this.handleFailureWithGrace();
        });
    }

    /**
     * Any logic necessary prior to setup and render loop, can live here.
     * @returns {Promise}
     */
    preinit() {
        return new Promise((resolve, reject) => {
            return resolve();
        });
    }

    /**
     * A planned method to deal with negative things...
     */
    handleFailureWithGrace() {
        return;
    }

    /**
     * Initialising/Bootstrapping and render loop kickoff.
     */
    init() {
        document.body.style.background = "#d7f0f7";

        // First let setupThree happen, then setupWorld, then fire the render loop.
        this.setupThree().then(() => {
            this.setupWorld().then(() => {

                /**
                 * This is the only way I can get es6 arrow operator + recursive function to work :|
                 */
                var animate = () => {
                    this.renderer.render(this.scene, this.camera);
                    requestAnimationFrame(animate);
                };

                requestAnimationFrame(animate);

            });
        }).catch((e) => {
            console.log('setupThree Unhappy: ' + e);
        });
    }

    /**
     * Setup THREE specifics, scene, cameras, etc.
     * @returns {Promise}
     */
    setupThree() {
        console.log('Running setupThree()');
        return new Promise((resolve, reject) => {
            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 5000);
            this.camera.position.y = 400;
            this.camera.position.z = 1500;
            this.camera.position.x = -40 * Math.PI / 180;   // rotation = radians, tilt camera 40 degrees down.

            this.getRenderer(RENDERER).then((renderer) => {
                this.renderer = renderer;
                this.renderer.setSize(window.innerWidth, window.innerHeight);

                document.body.appendChild(this.renderer.domElement)
                return resolve();
            });
        });
    }

    /**
     * Gets the current renderer, else creates one.
     * If webGL is specified, but not available, Canvas is returned in any case.
     * @returns {THREE.CanvasRenderer|*|CanvasRenderer|THREE.WebGLRenderer}
     */
    getRenderer(renderType) {

        // @todo - break out options to Tuning
        let rendererOpts = {
            antialias: true
        };

        return new Promise((resolve, reject) => {
            if (!this.renderer) {
                if (renderType == 'webgl' && this.webglAvailable()) {
                    console.log('Creating a WebGLRenderer Instance.');
                    this.renderer = new THREE.WebGLRenderer(rendererOpts);
                } else {
                    console.log('Creating a CanvasRenderer Instance.');
                    this.renderer = new THREE.CanvasRenderer();
                }
            }
            return resolve(this.renderer);
        });
    }

    /**
     * Ripped method. Test for webGL capability.
     * @returns {boolean}
     */
    webglAvailable() {
        try {
            let canvas = document.createElement( 'canvas' );
            return !!( window.WebGLRenderingContext &&
                (
                    canvas.getContext( 'webgl' ) ||
                    canvas.getContext( 'experimental-webgl' )
                )
            );
        } catch ( e ) {
            return false;
        }
    }

    /**
     * Setup the world aspects, cloned/merged objects, groundplane etc.
     * @returns {Promise}
     */
    setupWorld() {
        console.log('Running setupWorld()');

        return new Promise((resolve, reject) => {
            // Ground plane
            var groundGeo = new THREE.PlaneGeometry(2000, 2000, 20, 20);
            var groundMat = new THREE.MeshBasicMaterial(
                {
                    color: 0x9db3b5,
                    overdraw: true
                }
            );
            this.ground = new THREE.Mesh(groundGeo, groundMat);

            // rotate ground plane to proper orientation and add to scene
            this.ground.rotation.x = -90 * Math.PI / 180;
            this.scene.add(this.ground);


            /**
             * HACK IN SOME CRATES FOR NOW
             */

            let crateGroup = new CrateGroup(5);
            //for (let n of crateGroup.generateCrate(20)) {
            //    this.scene.add(n);
            //}
            this.scene.add(crateGroup.generateCrateMeshMergedGroup(10));
            /**
             * ====== /HACK ====
             */



            return resolve();
        });
    }

};

module.exports = Setup;
