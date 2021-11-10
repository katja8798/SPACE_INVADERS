// Multi-Sound Preloader

"use strict";

/*jslint browser: true, devel: true, white: true */

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

function soundsPreload(requiredSounds, loadedSounds, completionCallback) {

    let currName,
        numSoundsHandled = 0,
        numSoundsRequired = requiredSounds.length,
        loaded = function() {
            if (numSoundsHandled === numSoundsRequired) {
                completionCallback();
            }
        };

    for(currName in requiredSounds) {
        loadedSounds[currName] = new Audio();
        loadedSounds[currName].addEventListener('loaded', loaded, false);
        loadedSounds[currName].src = requiredSounds[currName];
        numSoundsHandled++;
    }
}