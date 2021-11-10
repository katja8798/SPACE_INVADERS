// =========
// ASTEROIDS
// =========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

const g_canvas = document.getElementById("myCanvas");
const g_ctx = g_canvas.getContext("2d");

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

let g_allowMixedActions = true;
let g_useGravity = false;
let g_useAveVel = true;
let g_renderSpatialDebug = false;

const KEY_MIXED = keyCode('M');
const KEY_GRAVITY = keyCode('G');
const KEY_AVE_VEL = keyCode('V');
const KEY_SPATIAL = keyCode('X');

const KEY_HALT = keyCode('H');
const KEY_RESET = keyCode('R');


const KEY_1 = keyCode('1');
const KEY_2 = keyCode('2');

const KEY_K = keyCode('K');

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

let g_images = {};
let g_sounds = {};

function requestPreloads() {

    const requiredSounds = {
        bulletFire : "sounds/bulletFire.ogg",
        bulletZapped : "sounds/bulletZapped.ogg",
        backgroundMusic : "sounds/backgroundMusic.ogg"
    };

    soundsPreload(requiredSounds, g_sounds, preloadSoundsDone)

    const requiredImages = {
        ship   : "https://notendur.hi.is/~pk/308G/images/ship.png",
        ship2  : "https://notendur.hi.is/~pk/308G/images/ship_2.png"
    };

    imagesPreload(requiredImages, g_images, preloadImagesDone);
}

let g_sprites = {};


function preloadSoundsDone() {
}

function preloadImagesDone() {
    g_sprites.ship  = new Sprite(g_images.ship);
    g_sprites.ship2 = new Sprite(g_images.ship2);
    g_sprites.bullet = new Sprite(g_images.ship);
    g_sprites.bullet.scale = 0.25;
    entityManager.init();
    createInitialShips();
    playGame();
}

function playGame(){
    main.init();
}

// Kick it off
requestPreloads();