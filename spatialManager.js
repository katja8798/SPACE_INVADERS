/*

spatialManager.js

A module which handles spatial lookup, as required for...
e.g. general collision detection.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

const spatialManager = {

// "PRIVATE" DATA

    _nextSpatialID: 1, // make all valid IDs non-falsey (i.e. don't start at 0)

    _entities: [],

// "PRIVATE" METHODS
//
// <none yet>


// PUBLIC METHODS

    getNewSpatialID: function () {
        return this._nextSpatialID++;
    },

    register: function (entity) {
        const pos = entity.getPos();
        const spatialID = entity.getSpatialID();

        this._entities[spatialID] = entity;
        this._entities[spatialID].posX = pos.posX;
        this._entities[spatialID].posY = pos.posY;
        this._entities[spatialID].radius = entity.getRadius();
    },

    unregister: function (entity) {
        const spatialID = entity.getSpatialID();

        delete this._entities[spatialID];
    },

    findEntityInRange: function (posX, posY, radius) {
        for (let id in this._entities) {
            let entity = this._entities[id];
            if (entity) {
                let ePosX = entity.posX,
                    ePosY = entity.posY,
                    eRad = entity.radius;
                if (Math.sqrt(Math.pow(posX - ePosX, 2) + Math.pow(posY - ePosY, 2)) <
                    radius + eRad) {
                    return entity;
                }
            }
        }
        return false;
    },

    render: function (ctx) {
        const oldStyle = ctx.strokeStyle;
        ctx.strokeStyle = "red";

        for (const ID in this._entities) {
            const e = this._entities[ID];
            util.strokeCircle(ctx, e.posX, e.posY, e.radius);
        }
        ctx.strokeStyle = oldStyle;
    }

};
