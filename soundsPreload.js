// Multi-Sound Preloader

"use strict";

/*jslint browser: true, devel: true, white: true */

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
            numSoundsHandled++;
        };

    for(currName in requiredSounds) {
        loadedSounds[currName] = new Audio();
        loadedSounds[currName].addEventListener('loaded', loaded, false);
        loadedSounds[currName].src = requiredSounds[currName];
    }
}

const  KEY_MUSIC = keyCode('N'),
    KEY_SOUND = keyCode('K');

let soundOn = true,
    musicOn = true;

function playSound(p){
    if (soundOn) {
        p.pause();
        p.currentTime = 0;
        p.play();
    }
}

function playBackgroundMusic(){
    musicOn? playMusic(g_sounds.backgroundMusic2) : pauseMusic(g_sounds.backgroundMusic2);
}

function playMusic(p){
    p.loop = true;
    p.play();
}

function pauseMusic(p){
    p.pause();
}