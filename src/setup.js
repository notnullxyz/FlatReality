"use strict";

let THREE = require('three');
let mainLoop = require('./renderloop');
let World = require('./world');

const RENDERER = "webgl";   // or 'canvas' or ...

class Setup {

    /**
     * Setup constructor.
     * Initiated pre-init, on resolve, initiates init.
     */
    constructor() {
        this.preinit().then(() => {
            this.init();
        }).catch(() => {
            this.handleFailureWithGrace();
        });
    }

    /**
     * Any logic necessary prior to setup and render loop, can live here.
     * This is probably where configuration loading will have to happen.
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
        // @TODO
        return;
    }

    /**
     * Initialising/Bootstrapping and render loop kickoff.
     */
    init() {
        document.body.style.background = "#19194d";

        // First let setupThree happen, then setupWorld, then fire the render loop.
        this.setupThree().then(() => {
            this.world = new World(this.scene);
            this.world.initWorld().then(() => {

                /**
                 * This is the only way I can get es6 arrow operator + recursive function to work.
                 */
                var animate = () => {
                    mainLoop();
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
            this.scene = new THREE.Scene();                     // create Scene
            this.camera = this.setupInitialCamera();            // Setup Camera

            this.initializeRenderer(RENDERER).then((renderer) => {     // Setup Renderer
                this.renderer = renderer;
                this.renderer.setSize(window.innerWidth, window.innerHeight);
                document.body.appendChild(this.renderer.domElement)
                return resolve();
            });
        });
    }

    /**
     * Create and set up the initial camera.
     * @returns {*|PerspectiveCamera}
     */
    setupInitialCamera() {
        let camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 5000);
        camera.position.y = 120;
        camera.position.z = 1000;
        camera.position.x = -20 * Math.PI / 180;   // rotation = radians, tilt camera 20 degrees down.
        return camera;
    }

    /**
     * Gets the current renderer, else creates one and configures it.
     * If webGL is specified, but not available, Canvas is returned in any case.
     * @returns {THREE.CanvasRenderer|*|CanvasRenderer|THREE.WebGLRenderer}
     */
    initializeRenderer(renderType) {

        // @todo - break out options to Tuning ---------------
        let rendererOpts = {
            antialias: true
        };
        let config = {
            shadowMapSoft: true,
            shadowMapEnabled: true
        }
        // ---------------------------------------------------

        return new Promise((resolve, reject) => {
            if (!this.renderer) {
                if (renderType == 'webgl' && this.webglAvailable()) {
                    console.log('Creating a WebGLRenderer Instance.');
                    this.renderer = new THREE.WebGLRenderer(rendererOpts);

                    // Configure Shadows from config
                    this.renderer.shadowMap.enabled = config.shadowMapEnabled;
                    this.renderer.shadowMapSoft = config.shadowMapSoft;

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

}

module.exports = Setup;
