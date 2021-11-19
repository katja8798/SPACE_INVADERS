/*

entityManager.js

A module which handles arbitrary entity-management for "Galaga"


We create this module as a single global object, and initialise it
with suitable 'data' and 'methods'.

"Private" properties are denoted by an underscore prefix convention.

*/


"use strict";


// Tell jslint not to complain about my use of underscore prefixes (nomen),
// my flattening of some indentation (white), or my use of incr/decr ops 
// (plusplus).
//
/*jslint nomen: true, white: true, plusplus: true*/


const entityManager = {

// "PRIVATE" DATA
    _background: [],
    _backgroundNumber: 0,
    _bullets: [],
    _ships: [],
    _enemies: [],
    _powerUps: [],
    _spawns: [],


// "PRIVATE" METHODS

    _findNearestShip: function (posX, posY) {
        let closestShip = null,
            closestIndex = -1,
            closestSq = 1000 * 1000;

        for (let i = 0; i < this._ships.length; ++i) {

            const thisShip = this._ships[i];
            const shipPos = thisShip.getPos();
            const distSq = util.wrappedDistSq(
                shipPos.posX, shipPos.posY,
                posX, posY,
                g_canvas.width, g_canvas.height);

            if (distSq < closestSq) {
                closestShip = thisShip;
                closestIndex = i;
                closestSq = distSq;
            }
        }
        return closestShip;
    },

    _forEachOf: function (aCategory, fn) {
        for (let i = 0; i < aCategory.length; ++i) {
            fn.call(aCategory[i]);
        }
    },

// PUBLIC METHODS

// A special return value, used by other objects,
// to request the blessed release of death!
//
    KILL_ME_NOW: -1,

// Some things must be deferred until after initial construction
// i.e. thing which need `this` to be defined.
//
    deferredSetup: function () {
        this._categories = [
            this._bullets,
            this._ships,
            this._enemies,
            this._powerUps,
            this._spawns
        ];
    },

    fireBullet: function (cx, cy, velX, velY) {
        this._bullets.push(new Bullet({
            cx: cx,
            cy: cy,
            velX: velX,
            velY: velY,
        }));
    },

    fireEnemyBullet: function(cx, cy, velX, velY) {
        this._bullets.push(new Bullet({
            cx: cx,
            cy: cy,
            velX: velX,
            velY: velY,
            sprite: g_sprites.enemyBullet
        }));
    },

    generateBackground: function (descr) {
        this._background.push(new Background(descr));
    },

    generateShip: function (descr) {
        this._ships.push(new Ship(descr));
    },

    generateEnemies: function (descr) {
        this._enemies.push(new Enemy(descr));
    },

    generateSpawn: function (descr) {
        const n = Math.round(util.randRange(4, 7));
        for (let i = 0; i < n; i++) {
            this._spawns.push(new Spawn(descr));
        }
    },

    generatePowerUp: function (descr) {
        this._powerUps.push(new PowerUp(descr));
    },

    maybeGeneratePowerUp: function () {
        const chance = util.randRange(0, 1000);
        if (chance < 10) {
            const num = util.randRange(0, 10);
            let s;

            if (num <= 5) {
                s = g_sprites.purpleRock;
            }
            else if (num <= 8) {
                s = g_sprites.greenRock;
            }
            else {
                s = g_sprites.yellowRock;
            }

            entityManager.generatePowerUp({
                sprite: s
            });
        }
    },

    resetShips: function () {
        this._forEachOf(this._ships, Ship.prototype.reset);
    },

    init: function () {

    },

    killAllEnemies: function () {
        for (let e = 0; e < this._enemies.length; e++) {
            this._enemies[e].kill();
        }
        levelManager.skipLevel();
    },

    //bullets and power ups
    killExtra: function () {
        for (let e = 0; e < this._bullets.length; e++) {
            this._bullets[e].kill();
        }
        for (let e = 0; e < this._powerUps.length; e++) {
            this._powerUps[e].kill();
        }
    },

    powerUpOff: function (){
        const ship = this._findNearestShip(0, 0);
        ship.powerUpBullet = false;
    },

    update: function (du) {
        for (let c = 0; c < this._categories.length; ++c) {
            const aCategory = this._categories[c];
            let i = 0;
            while (i < aCategory.length) {
                const status = aCategory[i].update(du);
                    if (status === this.KILL_ME_NOW) {
                        // remove the dead guy, and shuffle the others down to
                        // prevent a confusing gap from appearing in the array
                        aCategory.splice(i, 1);
                    } else {
                        ++i;
                    }
            }
        }
    },

    render: function (ctx) {
        let debugX = 10, debugY = 100;
        for (let c = 0; c < this._categories.length; ++c) {
            const aCategory = this._categories[c];
            for (let i = 0; i < aCategory.length; ++i) {
                aCategory[i].render(ctx);
                //debug.text(".", debugX + i * 10, debugY);
            }
            debugY += 10;
        }
        paths.render(ctx);
    },

    //Separate cause only one should be render/update at any one time
    updateBackground: function (du) {
        if (gameState.currState === gameState.states[0]) {
            this._backgroundNumber = 0;
        }
        else if (gameState.currState === gameState.states[2]){
            this._backgroundNumber = 5;
        }
        else if ((gameState.currState === gameState.states[3]) ||
            (gameState.currState === gameState.states[3])){
            this._backgroundNumber = 6;
        }

        this._background[this._backgroundNumber].update(du);
    },

    renderBackground: function (ctx) {
        this._background[this._backgroundNumber].render(ctx);
    },

    changeBackgroundForLvl: function (num){
        this._backgroundNumber = num;
    }
};

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();

