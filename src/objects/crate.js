"use strict";

let THREE = require('three');
let WorldObject = require('./WorldObject');

const DEFAULT_CRATE_COLOR = 0xbfbfbf;

/**
 * A merged geometry of crates, procedurally generated.
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
            this.crateMaterial = new THREE.MeshLambertMaterial(
                {
                    overdraw: true,
                    color: this.color
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
     * @returns {*|Geometry}
     */
    generateCrateMeshMergedGroup(quantity, color = DEFAULT_CRATE_COLOR) {
        // The merged new geometry to store everything in.
        let crateGroupGeometry = new THREE.Geometry();
        let count = 0;
        let sharedMaterial = undefined;

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
        return crateGroupMesh;
    }

    /**
     * Create Crate Generator generates standlone, unmerged crate meshes.
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
