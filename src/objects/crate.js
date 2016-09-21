"use strict";

let THREE = require('three');
let WorldObject = require('./WorldObject');

let AssetLoader = require("../AssetLoader");

const DEFAULT_CRATE_COLOR = 0xbfbfbf;

// not ideal, just for now... keep textures required here:
// This stuff will go to server config when I get time for config daemon.
const T_crateTexture = "http://notnull.xyz/cdn/tex/metalbox_diffuse.png";
const T_crateBump = "http://notnull.xyz/cdn/tex/metalbox_bump.png";


/**
 * A merged geometry of crates, procedurally generated.
 * @author Marlon van der Linde <marlon@notnull.xyz>
 */
class CrateGroup extends WorldObject {

    /**
     * Constructor for CrateGrouo.
     * @param crateSizeSquareAverage The average size of crates in the group.
     */
    constructor(crateSizeSquareAverage) {
        super('CrateGroup created');
        this.crateSizeSquareAverage = crateSizeSquareAverage;
        this.createdCratesCount = 0;
        this.baseCrateExists = false;
        this.color = DEFAULT_CRATE_COLOR;
        this.assetLoader = new AssetLoader();
    }

    /**
     * Creates a single cloned crate from the original (base) crate.
     * @param color Optional color in Hex, defaults to a shade of grey.
     * @returns {*|Mesh}
     */
    createClonedCrateMesh(color = DEFAULT_CRATE_COLOR) {
        this.color = color;
        if (!this.baseCrateExists) {
            /**
             * Explanation:
             * Create the base crate, so we can clone off it, then:
             * Move crate origin to bottom by shifting y coords of every vertex and face 0.5 units up.
             * Use a matrix that represent vertical translation.
             */
            this.crateGeometry = new THREE.CubeGeometry(1, 1, 1);
            this.crateGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0.5, 0));
            let mapTex = this.assetLoader.getTex(T_crateTexture);
            let bumpTex = this.assetLoader.getTex(T_crateBump);
            this.crateMaterial = new THREE.MeshPhongMaterial(
                {
                    overdraw: true,
                    color: this.color,
                    map: mapTex,
                    bumpMap: bumpTex
                });
            this.baseCrateExists = true;
        }

        let crateMesh = new THREE.Mesh(this.crateGeometry.clone(), this.crateMaterial.clone());
        crateMesh.position.x = Math.floor(Math.random() * 200 - 100) * 6;
        crateMesh.position.z = Math.floor(Math.random() * 200 - 100) * 6;
        crateMesh.scale.x = Math.random() * this.crateSizeSquareAverage;
        crateMesh.scale.y = crateMesh.scale.x * 1.2;
        crateMesh.scale.z = crateMesh.scale.x;
        return crateMesh;
    }

    /**
     * Generates a merged group of crate meshes, preferred for optimization.
     * @param quantity Numbers of crates in the group.
     * @param color Color in Hex, optional. Defaults to a shade of grey.
     * @returns {Promise}
     */
    generateCrateMeshMergedGroup(quantity, color = DEFAULT_CRATE_COLOR) {
        // The merged new geometry to store everything in.
        let crateGroupGeometry = new THREE.Geometry();
        let count = 0;
        let sharedMaterial = undefined;

        this.assetLoader.queueTex(T_crateTexture);
        this.assetLoader.queueTex(T_crateBump);
        console.log('Textures queue, going to download now.');

        return new Promise((resolve, reject) => {
            this.assetLoader.loadAll().then(() => {
                console.log('All downloaded.... lets create cubes.');
                /**
                 * Generates crate meshes as n for quantity
                 */
                for (let n of this.generateCrateMesh(quantity)) {
                    count++;
                    n.updateMatrix();
                    // merge the new crate geom and it's matrix into the single group
                    crateGroupGeometry.merge(n.geometry, n.matrix);

                    // Grab the material one time, will apply this to everything.
                    // Material is determined by crate creation method, so just steal it from there.
                    if (!sharedMaterial) {
                        sharedMaterial = n.material;
                    }
                }

                let crateGroupMesh = new THREE.Mesh(crateGroupGeometry, sharedMaterial);
                if (true) { // @todo shadowconfig, move it to Tuning!
                    crateGroupMesh.castShadow = true;
                    crateGroupMesh.receiveShadow = true;
                }

                resolve(crateGroupMesh);
            });
        });
    }

    /**
     * Create Crate Generator generates standalone, unmerged crate meshes.
     * @param quantity Numbers of crates to generate.
     */
    *generateCrateMesh (quantity) {
        while (this.createdCratesCount < quantity) {
            yield this.createClonedCrateMesh();
            this.createdCratesCount++;
        }
    }

}

module.exports = CrateGroup;
