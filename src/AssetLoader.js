"use strict";

const THREE = require("three");

/**
 * An attempt at a reliable loader that integrates with Three's texture loader and manager.
 */
class AssetLoader {

    constructor() {
        // instantiate a Three manager.
        this.manager = new THREE.LoadingManager();

        // setup handlers for manager
        this.manager.onProgress = this.managerOnProgress;
        this.manager.onLoad = this.managerOnLoad;

        // a local cache of loaded assets
        this.cache = {};

        this.queue = [];
        this.queue["textures"] = [];
    }


    /**
     * Add a Texture to the loader queue.
     * Specific types to load, require specific loaders.
     * @param {String} textureToLoad Path to the texture to enqueue.
     */
    queueTex(textureToLoad) {
        this.queue["textures"].push(textureToLoad);
    }

    // queue other things here.


    /**
     * Traverse the queue, load everything.
     * @returns {Promise}
     */
    loadAll() {
        let promisii = [];
        return new Promise((resolve, reject) => {

            // Process the texture queue
            this.queue["textures"].forEach((item) => {
                // push the load promise to a pile of empty promises.
                promisii.push(this.loadTexture(item).then((loadedTexture) => {
                    this.cache[item] = loadedTexture.image; // store the image on the cache.
                }));
            });

            // Process other queues here.

            // Wait for all of them before resolving.
            Promise.all(promisii).then(() => {
                console.log('All promise fulfilled.');
                resolve();
            });
        });
    }

    /**
     * Get a texture off the cache, if it exists.
     * @param {String} texToRetrieve The texture path as a key.
     * @returns {undefined|Texture}
     */
    getTex(texToRetrieve) {
        if (this.cache.hasOwnProperty(texToRetrieve)) {
            return this.cache[texToRetrieve];
        }
    }

    /**
     * Kill the entire cache.
     */
    nuke() {
        this.cache = [];
    }

    /**
     * Loads a texture. Each type has its own loadXXXX() method.
     * possibly going to use this or something like it to do workhorse loading.
     * @param texToLoad
     * @returns {Promise}
     */
    loadTexture(texToLoad) {
        return new Promise((resolve, reject) => {
            // texToLoad = crate.png
            let texture = new THREE.Texture();
            let loader = new THREE.TextureLoader(this.manager);
            loader.load(texToLoad, (image) => {
                console.log('load texture...');
                texture.image = image;
                texture.needsUpdate = true;
                this.cache[texToLoad] = texture;
                resolve(texture);
            });
        });
    }

    /**
     * Handlers for LoadingManager
     */

    /**
     * onProgress handler for the LoadingManager.
     * @param item
     * @param loaded
     * @param total
     */
    managerOnProgress(item, loaded, total) {
        console.log("manager: On progress");
        console.log( item, loaded, total );
    };

    /**
     * onLoad handler for the LoadingManager.
     * When all have been loaded, this fires.
     */
    managerOnLoad() {
        console.log('manager: All loaded.');
    }


    /**
     * Other Handlers
     */

}

module.exports = AssetLoader;
