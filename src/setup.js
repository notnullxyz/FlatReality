"use strict";

let THREE = require('three');

// Stuff added for devel
let CrateGroup = require("./objects/crate");
let LightFactory = require("./objects/lights/LightFactory");

let AssetLoader = require("./AssetLoader");

const RENDERER = "webgl";   // or 'canvas' or ...

class Setup {

    constructor() {
    }

    /**
     * Any logic necessary prior to setup and render loop, can live here.
     * @returns {Promise}
     */
    preinit() {
        return new Promise((resolve, reject) => {
            resolve();
        });
    }

    /**
     * A planned method to deal with negative things...
     */
    handleFailureWithGrace() {
        return;
    }

    /**
     * Create the start point, EMPTY WORLD before networking, before anything else.
     * This includes camera, ground, lights. Nothing else exists until the server says so... later.
     * @returns {Promise} wrapping object with properties renderer, scene, camera
     */
    init() {
        document.body.style.background = "#d7f0f7";
        return new Promise((resolve, reject) => {
            this.preinit().then(() => {
                this.setupThree().then(() => {      // Setup ThreeJS
                    this.setupWorld().then(() => {  // Set the Empty World initials
                        console.log('All done... ready to loop');
                        let vitals = {
                            renderer: this.renderer,
                            scene: this.scene,
                            camera: this.camera
                        };
                        resolve(vitals);
                    });
                }).catch((e) => {
                    this.handleFailureWithGrace();
                    console.log('setupThree Unhappy: ' + e);
                    reject(e);
                });
            });
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
            this.camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 5000);
            //this.camera.position.y = 120;
            //this.camera.position.z = 1000;
            //this.camera.position.x = -20 * Math.PI / 180;   // rotation = radians, tilt camera 20 degrees down.

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
        let config = {
            shadowMapSoft: true,
            shadowMapEnabled: true
        }

        return new Promise((resolve, reject) => {
            if (!this.renderer) {
                if (renderType == 'webgl' && this.webglAvailable()) {
                    console.log('Creating a WebGLRenderer Instance.');
                    this.renderer = new THREE.WebGLRenderer(rendererOpts);
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

    /**
     * Setup the world aspects, cloned/merged objects, groundplane etc.
     * @returns {Promise}
     */
    setupWorld() {
        console.log('Running setupWorld()');
        let assetLoader = new AssetLoader();

        return new Promise((resolve, reject) => {

            const groundTexNormal = "http://notnull.xyz/cdn/tex/stonetiles_003_norm.png";
            const groundTexDiffuse = "http://notnull.xyz/cdn/tex/stonetiles_003_diff.png";
            const GROUND_REPEAT = 256;

            assetLoader.queueTex(groundTexDiffuse); // ground texture diffuse
            assetLoader.queueTex(groundTexNormal); // ground texture normal

            assetLoader.loadAll().then(() => {

                let groundTexture = assetLoader.getTex(groundTexDiffuse);
                let groundBump = assetLoader.getTex(groundTexNormal);

                groundTexture.wrapS = THREE.RepeatWrapping;
                groundTexture.wrapT = THREE.RepeatWrapping;
                groundBump.wrapS = THREE.RepeatWrapping;
                groundBump.wrapT = THREE.RepeatWrapping;

                // Ground plane
                var groundGeo = new THREE.PlaneGeometry(3000, 3000, 20, 20);
                var groundMat = new THREE.MeshPhongMaterial(
                    {
                        color: 0x604020,
                        overdraw: true,
                        map: groundTexture,
                        bumpMap: groundBump
                    }
                );
                groundMat.map.repeat.set(GROUND_REPEAT, GROUND_REPEAT);
                this.ground = new THREE.Mesh(groundGeo, groundMat);
                this.ground.receiveShadow = true;   // @todo - break out options to Tuning

                // rotate ground plane to proper orientation and add to scene
                this.ground.rotation.x = -90 * Math.PI / 180;

                this.scene.add(this.ground);
                delete this.ground;

            });

            /**
             * HACK IN SOME STUFF FOR NOW
             */
            let crateGroup = new CrateGroup(20);
            //for (let n of crateGroup.generateCrate(20)) {
            //    this.scene.add(n);
            //}

            crateGroup.generateCrateMeshMergedGroup(500, 0x262626).then((crateGroupMesh) => {
                this.scene.add(crateGroupMesh);
            });

            let ambient = LightFactory.create('ambient');
            ambient.intensity = 0.95;

            let hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.9);
            hemiLight.color.setHSL(0.6, 1, 0.6);
            hemiLight.groundColor.setHSL(0.095, 1, 0.75);
            hemiLight.position.set(0, 500, 0);
            this.scene.add(hemiLight);

            let bulbLight = LightFactory.create('point', 0xffffff, 1, true, 2048, 800);
            bulbLight.position.set(600, 200, 35);

            let spotLight = LightFactory.create('spot', 0x66ff99, 1, true, 2048, 380);
            spotLight.position.set(25, 30, 55);

            // Some options for the spotLight
            spotLight.angle = Math.PI / 4;
            spotLight.penumbra = 0.25;
            spotLight.decay = 0.4;
            // spotLight.distance = 250;
            // spotLight.shadow.mapSize.width = 2048;
            // spotLight.shadow.mapSize.height = 2048;
            //spotLight.shadow.camera.near = 1;
            //spotLight.shadow.camera.far = 10;

            let spotHelper = new THREE.SpotLightHelper(spotLight);
            let bulbHelper = new THREE.PointLightHelper(bulbLight);

            this.scene.add(ambient);

            this.scene.add(spotLight);
            //this.scene.add(spotHelper);

            this.scene.add(bulbLight);
            //this.scene.add(bulbHelper);



            //this.scene.fog = new THREE.Fog(0x9db3b5, 600, 2000);  // linear fog
            //this.scene.fog = new THREE.FogExp2( 0xefd1b5, 0.0035 );
            //this.scene.fog = new THREE.Fog( 0xffffff, 1, 5000 );
            //this.scene.fog.color.setHSL( 0.6, 0, 1 );


            /**
             * ====== /HACK ====
             */



            return resolve();
        });
    }

};

module.exports = Setup;
