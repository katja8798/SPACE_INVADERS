// ==============
// SPACE INVADERS
// ==============

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

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
        cy : g_canvas.height-g_sprites.galagaShip.height/2-userInterface.height
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

function updateSimulation(dt, du) {
    
    processDiagnostics();
    playBackgroundMusic();

	levelManager.update(dt);

    formation.update(du);
    
    entityManager.update(du);

    entityManager.maybeGeneratePowerUp();

    // Prevent perpetual firing!
    eatKey(Ship.prototype.KEY_FIRE);
}

// GAME-SPECIFIC DIAGNOSTICS

let g_allowMixedActions = true;
let g_useAveVel = true;
let g_renderSpatialDebug = false;

const KEY_MIXED = keyCode('M');
const KEY_AVE_VEL = keyCode('V');
const KEY_SPATIAL = keyCode('X');

const KEY_RESET = keyCode('R');

const g_sounds = {};

function processDiagnostics() {

    if (eatKey(KEY_MIXED))
        g_allowMixedActions = !g_allowMixedActions;

    if (eatKey(KEY_AVE_VEL)) g_useAveVel = !g_useAveVel;

    if (eatKey(KEY_SPATIAL)) g_renderSpatialDebug = !g_renderSpatialDebug;

    if (eatKey(KEY_RESET)) entityManager.resetShips();

    if (eatKey(KEY_MUSIC)) {
        musicOn = !musicOn;
    }

    if (eatKey(KEY_SOUND)) {
        soundOn = !soundOn;
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

	paths.render(ctx);
    formation.render(ctx);
    entityManager.render(ctx);
    userInterface.render(ctx);

    if (g_renderSpatialDebug) spatialManager.render(ctx);
}


// =============
// PRELOAD STUFF
// =============

const g_images = {};

function requestPreloads() {

    const requiredSounds = {
        bulletFire: "sounds/bulletFire.ogg",
        bulletZapped: "sounds/bulletZapped.ogg",
        backgroundMusic: "sounds/backgroundMusic.ogg",
        backgroundMusic2: "sounds/backgroundMusic2.ogg",
        backgroundMusic3: "sounds/music.ogg",
        enemyHit : "sounds/enemyHit.ogg",
        rockSplit : "sounds/rockSplit.ogg",
    };

    soundsPreload(requiredSounds, g_sounds, preloadSoundsDone);

    const requiredImages = {
        ship: "img/ship.png",
        ship2: "img/ship_2.png",
        galagaShip: "img/galagaShip.png",
        heart: "img/heart_full_32x32.png",
        bullet: "img/bullet.png",
        bee: "images/bee.png",
        purpleRock: "img/purpleRock.png",
        greenRock: "img/greenRock.png",
        yellowRock: "img/yellowRock.png"
    };

    imagesPreload(requiredImages, g_images, preloadImagesDone);
}

const g_sprites = {};

function preloadSoundsDone() {
    console.log("preloading sounds successful");
}

function preloadImagesDone() {
    //ships
    g_sprites.ship  = new Sprite(g_images.ship);
    g_sprites.ship2 = new Sprite(g_images.ship2);
    g_sprites.galagaShip = new Sprite(g_images.galagaShip);

    //power ups
    g_sprites.purpleRock = new Sprite(g_images.purpleRock);
    g_sprites.greenRock = new Sprite(g_images.greenRock);
    g_sprites.yellowRock = new Sprite(g_images.yellowRock);

    //enemies
    g_sprites.bee = new Sprite(g_images.bee);
    g_sprites.bee.scale = 0.5;

    //bullets
    g_sprites.bullet = new Sprite(g_images.bullet);
    g_sprites.bullet.scale = 0.5;

    //other
    g_sprites.heart = new Sprite(g_images.heart);

    playGame();
}

function playGame(){

	paths.init();
    formation.init();
	levelManager.init();
    entityManager.init();
    createInitialShips();

    main.init();
}

// Kick it off
requestPreloads();