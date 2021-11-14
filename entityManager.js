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

    _bullets: [],
    _ships: [],
    _enemies: [],
    _powerUps: [],


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
        return {
            theShip: closestShip,
            theIndex: closestIndex
        };
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
        this._categories = [this._bullets, this._ships, this._enemies, this._powerUps];
    },

    fireBullet: function (cx, cy, velX, velY, rotation) {
        this._bullets.push(new Bullet({
            cx: cx,
            cy: cy,
            velX: velX,
            velY: velY,

            rotation: rotation
        }));
    },


    generatePowerUp: function (descr) {
        this._powerUps.push(new PowerUp(descr));
    },

    generateShip: function (descr) {
        this._ships.push(new Ship(descr));
    },

    generateEnemies: function (descr) {
        this._enemies.push(new Enemy(descr));
    },

    maybeGeneratePowerUp: function () {
        const chance = util.randRange(0, 1000);
        if (chance < 5) {
            const num = Math.round(util.randRange(1, 10));

            switch (num) {
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                    entityManager.generatePowerUp({
                        sprite: g_sprites.purpleRock
                    });
                    break;
                case 6:
                case 7:
                case 8:
                    entityManager.generatePowerUp({
                        sprite: g_sprites.greenRock
                    });
                    break;
                case 9:
                case 10:
                    entityManager.generatePowerUp({
                        sprite: g_sprites.yellowRock
                    });
                    break;
                default:
                    entityManager.generatePowerUp({
                        sprite: g_sprites.purpleRock
                    });
                    break;
            }
        }
    },

    resetShips: function () {
        this._forEachOf(this._ships, Ship.prototype.reset);
    },

    init: function () {

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
    }

};

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();

