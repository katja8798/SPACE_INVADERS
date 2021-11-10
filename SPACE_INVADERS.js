// =========
// SPACE INVADERS
// =========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// ====================
// CREATE INITIAL SHIPS
// ====================

function createInitialShips() {
    entityManager.generateShip({
        cx : g_canvas.width/2,
        cy : g_canvas.height-g_sprites.ship.height/2
    });
}

// =============
// GATHER INPUTS
// =============

function gatherInputs() {
    // Nothing to do here!
    // The event handlers do everything we need for now.
}


// =================
// UPDATE SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `update` routine handles generic stuff such as
// pausing, single-step, and time-handling.
//
// It then delegates the game-specific logic to `updateSimulation`


// GAME-SPECIFIC UPDATE LOGIC

function updateSimulation(du) {

    processDiagnostics();

    entityManager.update(du);

    // Prevent perpetual firing!
    eatKey(Ship.prototype.KEY_FIRE);
}

// GAME-SPECIFIC DIAGNOSTICS

var g_allowMixedActions = true;
var g_useGravity = false;
var g_useAveVel = true;
var g_renderSpatialDebug = false;

var KEY_MIXED   = keyCode('M');
var KEY_GRAVITY = keyCode('G');
var KEY_AVE_VEL = keyCode('V');
var KEY_SPATIAL = keyCode('X');

var KEY_HALT  = keyCode('H');
var KEY_RESET = keyCode('R');


var KEY_1 = keyCode('1');
var KEY_2 = keyCode('2');

var KEY_K = keyCode('K');
var backgroundMusicOn = false;

function processDiagnostics() {

    if (eatKey(KEY_MIXED))
        g_allowMixedActions = !g_allowMixedActions;

    if (eatKey(KEY_GRAVITY)) g_useGravity = !g_useGravity;

    if (eatKey(KEY_AVE_VEL)) g_useAveVel = !g_useAveVel;

    if (eatKey(KEY_SPATIAL)) g_renderSpatialDebug = !g_renderSpatialDebug;

    if (eatKey(KEY_HALT)) entityManager.haltShips();

    if (eatKey(KEY_RESET)) entityManager.resetShips();

    if (eatKey(KEY_1)) entityManager.generateShip({
        cx : g_mouseX,
        cy : g_mouseY,

        sprite : g_sprites.ship});

    if (eatKey(KEY_2)) entityManager.generateShip({
        cx : g_mouseX,
        cy : g_mouseY,

        sprite : g_sprites.ship2
    });

    if (eatKey(KEY_K)) entityManager.killNearestShip(
        g_mouseX, g_mouseY);

    if(!backgroundMusicOn) {
        playMusic(g_sounds.backgroundMusic3);
        backgroundMusicOn = true;
    }
}


// =================
// RENDER SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `render` routine handles generic stuff such as
// the diagnostic toggles (including screen-clearing).
//
// It then delegates the game-specific logic to `gameRender`


// GAME-SPECIFIC RENDERING

function renderSimulation(ctx) {

    entityManager.render(ctx);

    if (g_renderSpatialDebug) spatialManager.render(ctx);
}


// =============
// PRELOAD STUFF
// =============

var g_images = {},
    g_sounds = {};

function playSound(p){
    p.pause();
    p.currentTime = 0;
    p.play();
}

function playMusic(p){
    p.loop = true;
    p.play();
}

function requestPreloads() {

    var requiredSounds = {
        bulletFire : "sounds/bulletFire.ogg",
        bulletZapped : "sounds/bulletZapped.ogg",
        backgroundMusic : "sounds/backgroundMusic.ogg",
        backgroundMusic2 : "sounds/backgroundMusic2.ogg",
        backgroundMusic3 : "sounds/music.ogg"
    };

    soundsPreload(requiredSounds, g_sounds, preloadSoundsDone);

    var requiredImages = {
        ship   : "https://notendur.hi.is/~pk/308G/images/ship.png",
        ship2  : "https://notendur.hi.is/~pk/308G/images/ship_2.png"
    };

    imagesPreload(requiredImages, g_images, preloadImagesDone);
}

var g_sprites = {};

function preloadSoundsDone() {
}

function preloadImagesDone() {
    g_sprites.ship  = new Sprite(g_images.ship);
    g_sprites.ship2 = new Sprite(g_images.ship2);
    g_sprites.bullet = new Sprite(g_images.ship);
    g_sprites.bullet.scale = 0.25;
    playGame();
}

function playGame(){
    entityManager.init();
    createInitialShips();

    main.init();
}



// Kick it off
requestPreloads();


