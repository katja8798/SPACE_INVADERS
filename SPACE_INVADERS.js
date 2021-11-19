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

function createBackgrounds() {
    entityManager.generateBackground({
        sprite : g_sprites.bStart
    });
    entityManager.generateBackground({
        sprite : g_sprites.bLvl1
    });
    entityManager.generateBackground({
        sprite : g_sprites.bLvl2
    });
    entityManager.generateBackground({
        sprite : g_sprites.bLvl3
    });
    entityManager.generateBackground({
        sprite : g_sprites.bLvl4
    });
    entityManager.generateBackground({
        sprite : g_sprites.bWin
    });
    entityManager.generateBackground({
        sprite : g_sprites.bLose
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
    gameState.update();
    entityManager.updateBackground(du);

    if(gameState.checkIfPlaying()) {
        levelManager.update(dt);

        formation.update(du);

        entityManager.update(du);

        // Prevent perpetual firing!
        eatKey(Ship.prototype.KEY_FIRE);
    }
}

// GAME-SPECIFIC DIAGNOSTICS

let g_allowMixedActions = true;
let g_useAveVel = true;
let g_renderSpatialDebug = false;

const KEY_MIXED = keyCode('M');
const KEY_AVE_VEL = keyCode('V');
const KEY_SPATIAL = keyCode('X');

const KEY_RESET = keyCode('R');

const KEY_SKIP = keyCode('L');



const g_sounds = {};

function processDiagnostics() {

    if (eatKey(KEY_MIXED))
        g_allowMixedActions = !g_allowMixedActions;

    if (eatKey(KEY_AVE_VEL)) g_useAveVel = !g_useAveVel;

    if (eatKey(KEY_SPATIAL)) g_renderSpatialDebug = !g_renderSpatialDebug;

    if (eatKey(KEY_RESET)) entityManager.resetShips();

    if(eatKey(KEY_SKIP)) entityManager.killAllEnemies();

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
    entityManager.renderBackground(ctx);

    if(gameState.checkIfPlaying()){
        formation.render(ctx);
        entityManager.render(ctx);
        userInterface.render(ctx);
        levelManager.render(ctx);

        if (g_renderSpatialDebug) spatialManager.render(ctx);
    } else {
        gameState.render(ctx);
    }

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
        shipColliding : "sounds/shipColliding.flac"
    };

    soundsPreload(requiredSounds, g_sounds, preloadSoundsDone);

    const requiredImages = {
        bStart : "img/bgStart.jpg",
        bLvl1 : "img/bgLong1.jpg",
        bLvl2 : "img/bgLong2.jpg",
        bLvl3 : "img/bgLong3.jpg",
        bLvl4 : "img/bgLong4.jpg",
        bWin : "img/bgWin.png",
        bLose : "img/bgLose.png",

        galagaShip   : "img/galagaShip.png",

        heart  : "img/heart_full_32x32.png",

        bullet : "img/bulletShip.png",
        enemyBullet : "img/bulletEnemy.png",

        purpleRock: "img/puPurpleRock.png",
        greenRock: "img/puGreenRock.png",
        yellowRock: "img/puYellowRock.png",

        butterfly : "img/enemyTypeButterfly.png",
        boss : "img/enemyTypeBoss.png",
        bee : "img/enemyTypeBee.png",
        purpleBoss : "img/enemyTypePurpleBoss_single.png",
    };

    imagesPreload(requiredImages, g_images, preloadImagesDone);
}

const g_sprites = {};

function preloadSoundsDone() {
    console.log("preloading sounds successful");
}

function preloadImagesDone() {
    //ship
    g_sprites.galagaShip  = new Sprite(g_images.galagaShip);

    //power ups
    g_sprites.purpleRock = new Sprite(g_images.purpleRock);
    g_sprites.greenRock = new Sprite(g_images.greenRock);
    g_sprites.yellowRock = new Sprite(g_images.yellowRock);

    //enemies
    g_sprites.bee = new Sprite(g_images.bee);
    g_sprites.bee.scale = 0.5;
    g_sprites.butterfly = new Sprite(g_images.butterfly);
    g_sprites.boss = new Sprite(g_images.boss);
    g_sprites.purpleBoss = new Sprite(g_images.purpleBoss);

    //bullets
    g_sprites.bullet = new Sprite(g_images.bullet);
    g_sprites.bullet.scale = 0.5;
    g_sprites.enemyBullet = new Sprite(g_images.enemyBullet);
    g_sprites.enemyBullet.scale = 0.5;

    //other
	g_sprites.heart = new Sprite(g_images.heart);

    //backgrounds
    g_sprites.bStart = new Sprite(g_images.bStart);
    g_sprites.bLvl1 = new Sprite(g_images.bLvl1);
    g_sprites.bLvl2 = new Sprite(g_images.bLvl2);
    g_sprites.bLvl3 = new Sprite(g_images.bLvl3);
    g_sprites.bLvl4 = new Sprite(g_images.bLvl4);
    g_sprites.bWin = new Sprite(g_images.bWin);
    g_sprites.bLose = new Sprite(g_images.bLose);


    playGame();
}

function playGame(){

	paths.init();
    formation.init();
    stars.init();
	levelManager.init();
    entityManager.init();
    createBackgrounds();
    createInitialShips();

    main.init();
}

// Kick it off
requestPreloads();