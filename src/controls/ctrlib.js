/**
 * ctrlib - ControlLib
 * This aggregates the Pointer Lock Control functionality, and all checks and inits needed for pointer lock control.
 * This file is terribly laid out, as are most examples and implementations of this, so it needs to be es6'd soon!
 * We instantiate PointerLockControls class here, thanks to mrdoob's examples in three.
 *
 * Just import ctrlib then:
 *   ctrlib.initControls();
 *   ctrlib.initPointerLock(camera);
 *   let controls = ctrlib.getControls();
 *   scene.add(controls);
 *
 * In the main loop:
 *   ctrlib.updateControls(timeDelta);
 *
 *   @author Marlon van der Linde
 */

let THREE = require("three");
let PointerLockControls = require("./PointerLockControls");

// == Globals required for pointer-lock functions ==
let clock = new THREE.Clock();
let controlsEnabled, controls;
let moveForward;
let moveBackward;
let moveLeft;
let moveRight;
let canJump;
let velocity = new THREE.Vector3();

var ctrlib = {
    checkForPointerLock: function() {
        return 'pointerLockElement' in document ||
            'mozPointerLockElement' in document ||
            'webkitPointerLockElement' in document;
    },

    getControls: function() {
      return controls.getObject();
    },

    initPointerLock: function(camera) {
        // Set up controls.
        controls = new PointerLockControls(camera);

        var element = document.body;

        if (havePointerLock) {
            var pointerlockchange = function (event) {
                if (document.pointerLockElement === element ||
                    document.mozPointerLockElement === element ||
                    document.webkitPointerLockElement === element) {
                    controlsEnabled = true;
                    controls.enabled = true;
                } else {
                    controlsEnabled = false;
                    controls.enabled = false;
                }
            };

            var pointerlockerror = function (event) {
                element.innerHTML = 'PointerLock Error';
            };

            document.addEventListener('pointerlockchange', pointerlockchange, false);
            document.addEventListener('mozpointerlockchange', pointerlockchange, false);
            document.addEventListener('webkitpointerlockchange', pointerlockchange, false);

            document.addEventListener('pointerlockerror', pointerlockerror, false);
            document.addEventListener('mozpointerlockerror', pointerlockerror, false);
            document.addEventListener('webkitpointerlockerror', pointerlockerror, false);

            var requestPointerLock = function (event) {
                element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
                element.requestPointerLock();
            };
            element.addEventListener('click', requestPointerLock, false);
        } else {
            element.innerHTML = 'Bad browser; No pointer lock';
        }
    },

    initControls: function() {
        document.addEventListener('keydown', ctrlib.onKeyDown, false);
        document.addEventListener('keyup', ctrlib.onKeyUp, false);
    },

    updateControls: function() {
        if (controlsEnabled) {
            var delta = clock.getDelta();
            var walkingSpeed = 200.0;

            velocity.x -= velocity.x * 10.0 * delta;
            velocity.z -= velocity.z * 10.0 * delta;
            velocity.y -= 9.8 * 100.0 * delta;

            if (moveForward) velocity.z -= walkingSpeed * delta;
            if (moveBackward) velocity.z += walkingSpeed * delta;
            if (moveLeft) velocity.x -= walkingSpeed * delta;
            if (moveRight) velocity.x += walkingSpeed * delta;

            controls.getObject().translateX(velocity.x * delta);
            controls.getObject().translateY(velocity.y * delta);
            controls.getObject().translateZ(velocity.z * delta);

            if (controls.getObject().position.y < 10) {
                velocity.y = 0;
                controls.getObject().position.y = 10;
                canJump = true;
            }
        }
    },

    onKeyDown: function(e) {
        switch (e.keyCode) {
            case 38: // up
            case 87: // w
                moveForward = true;
                break;
            case 37: // left
            case 65: // a
                moveLeft = true;
                break;
            case 40: // down
            case 83: // s
                moveBackward = true;
                break;
            case 39: // right
            case 68: // d
                moveRight = true;
                break;
            case 32: // space
                if (canJump === true) velocity.y += 350;
                canJump = false;
                break;
        }
    },

    onKeyUp: function(e) {
        switch (e.keyCode) {
            case 38: // up
            case 87: // w
                moveForward = false;
                break;
            case 37: // left
            case 65: // a
                moveLeft = false;
                break;
            case 40: // down
            case 83: // s
                moveBackward = false;
                break;
            case 39: // right
            case 68: // d
                moveRight = false;
                break;
        }
    }

};

let havePointerLock = ctrlib.checkForPointerLock();

module.exports = ctrlib;
