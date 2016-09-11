"use strict";

let THREE = require('three');
let WorldObject = require('./WorldObject');

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
    }

    /**
     * Creates a single cloned crate from the original (base) crate.
     */
    createClonedCrate() {
        if (!this.baseCrateExists) {
            /**
             * Explanation:
             * Create the base crate, so we can clone off it, then:
             * Move crate origin to bottom by shifting y coords of every vertex and face 0.5 units up.
             * Use a matrix that represent vertical translation.
             */
            this.crateGeometry = new THREE.CubeGeometry(1, 1, 1);
            this.crateGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0.5, 0));
            this.crateMaterial = new THREE.MeshDepthMaterial({overdraw: true});
            this.baseCrateExists = true;
        }

        let crate = new THREE.Mesh(this.crateGeometry.clone(), this.crateMaterial.clone());
        crate.position.x = Math.floor(Math.random() * 200 - 100) * 4;
        crate.position.z = Math.floor(Math.random() * 200 - 100) * 4;
        crate.scale.x = Math.random() * 50 + 10;
        crate.scale.y = Math.random() * crate.scale.x * 8 + 8;
        crate.scale.z = crate.scale.x;
        return crate;
    }

    /**
     * Generates a merged group of crate geometries, preferred for optimization.
     * @param quantity Numbers of crates in the group.
     * @returns {*|Geometry}
     */
    generateCrateMergedGroup(quantity) {
        // The merged new geometry to store everything in.
        let crateGroupGeometry = new THREE.Geometry();

        let tempMaterial = new THREE.MeshDepthMaterial({overdraw: true});

        for (let i = 0; i < quantity; i++) {
            console.log('CratedMergedGroup generating: ' + i);
            let crate = this.createClonedCrate();
            crate.updateMatrix();
            crateGroupGeometry.merge(crate.geometry, crate.matrix);
        }
        let crateGroupMesh = new THREE.Mesh(crateGroupGeometry, tempMaterial);
        return crateGroupMesh;
    }

    /**
     * Create Crate Generator generates standlone, unmerged crate geometries.
     * @param quantity Numbers of crates to generate.
     */
    *generateCrate (quantity) {
        while (this.createdCratesCount < quantity) {
            console.log('Generating crate number ' + this.createdCratesCount);
            yield this.createClonedCrate();
            this.createdCratesCount++;
        }
    }

}

module.exports = CrateGroup;
