"use strict";

const THREE = require("three");

/**
 * Texture and Other Asset Management.
 * An attempt at a reliable loader that integrates with Three's texture loader and manager.
 * Loads, caches and supplies assets, using Promises to ensure async romance.
 * Caching hogs memory conveniently, until references to handlers are nuked, so keep this in mind. Kill your references.
 * @author Marlon van der Linde <marlon@notnull.xyz>
 */
class AssetLoader {

    /**
     * Logic free construction.
     * Sets up cache object, queue array and handlers.
     * @param {undefined|Function} managerOnProgress Optional callback function for the Loader Manager on-progress event.
     * @param {undefined|Function} managerOnLoad Optional callback function for the Loader Manager on-load completed event.
     */
    constructor(managerOnProgress = undefined, managerOnLoad = undefined) {
        // instantiate a Three manager.
        this.manager = new THREE.LoadingManager();

        // setup handlers for manager
        this.manager.onProgress = managerOnProgress || this.managerOnProgress;
        this.manager.onLoad = managerOnLoad || this.managerOnLoad;

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
     * Should probably not use this. What if we kill a good reference :(
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
     * Default onProgress handler for the LoadingManager.
     * @param item
     * @param loaded
     * @param total
     */
    managerOnProgress(item, loaded, total) {
        console.log(`threeAsset - onProgress: Loading status: ${item} / ${loaded} / ${total}`);
    };

    /**
     * Default onLoad handler for the LoadingManager.
     * When all have been loaded, this fires.
     */
    managerOnLoad() {
        console.log('threeAsset - onLoad: All loaded.');
    }


}

module.exports = AssetLoader;
