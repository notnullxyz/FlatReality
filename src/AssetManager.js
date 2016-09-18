"use strict";

let THREE = require("three");

/**
 * Asset queue downloader and manager for FlatReality project.
 */
class AssetManager {

    constructor() {
        this.successCount = 0;
        this.errorCount = 0;
        this.queue = [];
        this.cache = {};
    }

    /**
     * Enqueue an asset by path, to be downloaded and cached.
     * @param {String} path Path to the asset.
     */
    enqueue(path) {
        console.log('queued path: ' + path);
        this.queue.push(path);
    }

    /**
     * Start fetching the queue of assets, and resolve a promise when completed.
     * @returns {Promise} Contains the number of assets queue, loaded and errored.
     */
    downloadQueue() {
        return new Promise((resolve, reject) => {
            if (this.queue.length === 0) {
                console.log('Empty queue, resolving.');
                return resolve([this.queue.length, this.successCount, this.errorCount]);
            }

            for (let i = 0; i < this.queue.length; i++) {
                let path = this.queue[i];
                let imageLoader = new THREE.TextureLoader();

                let onLoad = ((loadedImage) => {
                    console.log(' a load completed for ' + path);
                    this.successCount++;
                    this.cache[path] = loadedImage;
                    if (this._isComplete()) {
                        console.log('Completed, resolving from load.');
                        return resolve([this.queue.length, this.successCount, this.errorCount]);
                    }
                });

                let onError = ((error) => {
                    console.log('some error: ' + error);
                    this.errorCount++;
                    if (this._isComplete()) {
                        console.log('Completed, resolving from error.');
                        return resolve([this.queue.length, this.successCount, this.errorCount]);
                    }
                });

                console.log('trying a load...');
                imageLoader.load(path, onLoad);
            }
        });
    }

    /**
     * Used by the AssetManager itself to check completion state.
     * @returns {boolean}
     */
    _isComplete() {
        return (this.queue.length == this.successCount + this.errorCount);
    }

    /**
     * Fetch cached asset by path.
     * @param path
     * @returns {*}
     */
    getAsset(path) {
        console.log('Fetching cached asset : ' + path);
        return this.cache[path];
    }

}

module.exports = AssetManager;
