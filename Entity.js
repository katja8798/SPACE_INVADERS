// ======
// ENTITY
// ======
/*

Provides a set of common functions which can be "inherited" by all other
game Entities.

JavaScript's prototype-based inheritance system is unusual, and requires 
some care in use. In particular, this "base" should only provide shared
functions... shared data properties are potentially quite confusing.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


function Entity() {

/*
    // Diagnostics to check inheritance stuff
    this._entityProperty = true;
    console.dir(this);
*/

}

Entity.prototype.setup = function (descr) {

    // Apply all setup properties from the (optional) descriptor
    for (var property in descr) {
        this[property] = descr[property];
    }
    
    // Get my (unique) spatial ID
    this._spatialID = spatialManager.getNewSpatialID();
    
    // I am not dead yet!
    this._isDeadNow = false;

    this.isSpawn = false;
    this.spawnIsReg = true;
};

Entity.prototype.setPos = function (cx, cy) {
    this.cx = cx;
    this.cy = cy;
};

Entity.prototype.getPos = function () {
    return {posX : this.cx, posY : this.cy};
};

Entity.prototype.getRadius = function () {
    return 0;
};

Entity.prototype.getSpatialID = function () {
    return this._spatialID;
};

Entity.prototype.kill = function () {
    this._isDeadNow = true;
};

Entity.prototype.findHitEntity = function () {
    var pos = this.getPos();
    return spatialManager.findEntityInRange(
        pos.posX, pos.posY, this.getRadius()
    );
};

// This is just little "convenience wrapper"
Entity.prototype.isColliding = function () {
    return this.findHitEntity();
};

Entity.prototype.wrapPosition = function () {
    this.cx = util.wrapRange(this.cx, 0, g_canvas.width);
    this.cy = util.wrapRange(this.cy, 0, g_canvas.height);
};

Entity.prototype.randomisePosition = function () {
    let chance = Math.random(),
        x,
        y;

    //always appear from random edges
    if (chance < 0.33) {//left edge
        x = -this.getRadius();
        y = Math.random() * g_canvas.height/3*2;//always appear above ship
    } else if (chance < 0.66) {//right edge
        x = g_canvas.width + this.getRadius();
        y = Math.random() * g_canvas.height/3*2;//always appear above ship
    }
    else if (chance < 1) {//top edge
        x = Math.random() * g_canvas.width;
        y = -this.getRadius();
    }
    else {
        x = 0;
        y = 0;
    }

    // Rock randomisation defaults (if nothing otherwise specified)
    this.cx = this.cx || x;
    this.cy = this.cy || y;
    this.rotation = this.rotation || 0;
};

Entity.prototype.randomiseVelocity = function () {
    const MIN_SPEED = 60,
        MAX_SPEED = 90;

    const speed = util.randRange(MIN_SPEED, MAX_SPEED) / SECS_TO_NOMINALS;
    const dirn = Math.random() * consts.FULL_CIRCLE;

    this.velX = this.velX || speed * Math.cos(dirn);
    this.velY = this.velY || speed * Math.sin(dirn);

    const MIN_ROT_SPEED = 4.5,
        MAX_ROT_SPEED = 5.5;

    this.velRot = this.velRot ||
        util.randRange(MIN_ROT_SPEED, MAX_ROT_SPEED) / SECS_TO_NOMINALS;
};
