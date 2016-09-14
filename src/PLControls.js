"use strict";

// hack... import three with controls constructor on it.
let THREE = require("./controls/pointerlock");

class PLControls {

    constructor(camera) {
        this.havePointerLock = this.checkForPointerLock();
        this.controls = new THREE.PointerLockControls(camera);
        this.velocity = new THREE.Vector3();
        this.clock = new THREE.Clock();
        this.element = null;
        this.initControls();
        this.initPointerLock();
    }

    get() {
        return this.controls.getObject();
    }

    checkForPointerLock() {
        console.log('checkForPointerLock');
        return 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
    }

    initPointerLock() {
        console.log('initPointerLock');
        this.element = document.body;
        if (this.havePointerLock) {

            document.addEventListener('pointerlockchange', this.pointerlockchange, false);
            document.addEventListener('mozpointerlockchange', this.pointerlockchange, false);
            document.addEventListener('webkitpointerlockchange', this.pointerlockchange, false);

            document.addEventListener('pointerlockerror', this.pointerlockerror, false);
            document.addEventListener('mozpointerlockerror', this.pointerlockerror, false);
            document.addEventListener('webkitpointerlockerror', this.pointerlockerror, false);

            this.element.addEventListener('click', this.requestPointerLock, false);

        } else {
            this.element.innerHTML = 'Bad browser; No pointer lock';
        }
    }

    requestPointerLock(event) {
        console.log('requestPointerLock');
        this.element = document.body;   // had to shove this in here, element having been undefined. Not right...
        this.element.requestPointerLock = this.element.requestPointerLock || this.element.mozRequestPointerLock
            || this.element.webkitRequestPointerLock;
        this.element.requestPointerLock();
    }

    pointerlockchange(event) {
        console.log('pointerLockChange: ');
        console.log(this.controls);
        if (document.pointerLockElement === this.element ||
            document.mozPointerLockElement === this.element ||
            document.webkitPointerLockElement === this.element) {
            this.controlsEnabled = true;
            this.controls.enabled = true;
        } else {
            this.controls.enabled = false;
        }
    }

    pointerlockerror(event) {
        console.log('pointerLockError');
        this.element.innerHTML = 'PointerLock Error';
    }

    onKeyDown(e) {
        switch (e.keyCode) {
            case 38: // up
            case 87: // w
                this.moveForward = true;
                break;
            case 37: // left
            case 65: // a
                this.moveLeft = true;
                break;
            case 40: // down
            case 83: // s
                this.moveBackward = true;
                break;
            case 39: // right
            case 68: // d
                this.moveRight = true;
                break;
            case 32: // space
                if (this.canJump === true) this.velocity.y += 350;
                this.canJump = false;
                break;
        }
    }

    onKeyUp(e) {
        switch (e.keyCode) {
            case 38: // up
            case 87: // w
                this.moveForward = false;
                break;
            case 37: // left
            case 65: // a
                this.moveLeft = false;
                break;
            case 40: // down
            case 83: // s
                this.moveBackward = false;
                break;
            case 39: // right
            case 68: // d
                this.moveRight = false;
                break;
        }
    }

    initControls() {
        document.addEventListener('keydown', this.onKeyDown, false);
        document.addEventListener('keyup', this.onKeyUp, false);
        this.raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 10);
    }

    updateControls() {
        if (this.controlsEnabled) {
            let delta = this.clock.getDelta();
            let walkingSpeed = 200.0;

            this.velocity.x -= this.velocity.x * 10.0 * delta;
            this.velocity.z -= this.velocity.z * 10.0 * delta;
            this.velocity.y -= 9.8 * 100.0 * delta;

            if (this.moveForward) this.velocity.z -= walkingSpeed * delta;
            if (this.moveBackward) this.velocity.z += walkingSpeed * delta;

            if (this.moveLeft) this.velocity.x -= walkingSpeed * delta;
            if (this.moveRight) this.velocity.x += walkingSpeed * delta;

            if (this.moveForward || this.moveBackward || this.moveLeft || this.moveRight) {
                // play footstep sounds.
            }

            this.controls.getObject().translateX(this.velocity.x * delta);
            this.controls.getObject().translateY(this.velocity.y * delta);
            this.controls.getObject().translateZ(this.velocity.z * delta);

            if (this.controls.getObject().position.y < 10) {
                this.velocity.y = 0;
                this.controls.getObject().position.y = 10;
                this.canJump = true;
            }
        }
    }
}

module.exports = PLControls;
