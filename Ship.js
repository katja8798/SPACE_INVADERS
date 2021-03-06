// ==========
// SHIP STUFF
// ==========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic constructor which accepts an arbitrary descriptor object
function Ship(descr) {
    this.entityType = "ship";

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.rememberResets();
    
    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.galagaShip;
    
    // Set normal drawing scale
    this._scale = 1;

    this.powerUpBullet = false;
}

Ship.prototype = new Entity();

Ship.prototype.rememberResets = function () {
    // Remember my reset positions
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
    this.reset_rotation = this.rotation;
};


Ship.prototype.KEY_LEFT   = 'A'.charCodeAt(0);
Ship.prototype.KEY_RIGHT  = 'D'.charCodeAt(0);

// Some people might want to use arrow keys ('I' do :] )
Ship.prototype.KEY_ARROW_LEFT = 37;
Ship.prototype.KEY_ARROW_RIGHT = 39;

Ship.prototype.KEY_FIRE   = ' '.charCodeAt(0);

// Initial, inheritable, default values
Ship.prototype.rotation = 0;
Ship.prototype.cx = 200;
Ship.prototype.cy = 200;
Ship.prototype.velX = 0;
Ship.prototype.velY = 0;
Ship.prototype.launchVel = 3.5;

const NOMINAL_MOVEMENT = 5;

Ship.prototype.update = function (du) {
    
    spatialManager.unregister(this);
    if(this._isDeadNow){
        return entityManager.KILL_ME_NOW;
    }


    if (keys[this.KEY_LEFT] || keys[this.KEY_ARROW_LEFT]) {
        if(this.cx  < g_canvas.width-570 ){
            console.log(g_canvas.width)
            this.cx = this.cx;
        }
        else{
            this.cx -= NOMINAL_MOVEMENT*du;
        }

    }
    if (keys[this.KEY_RIGHT] || keys[this.KEY_ARROW_RIGHT]) {
        if(this.cx > g_canvas.width-30){
            this.cx = this.cx;
        }
        else {
            this.cx += NOMINAL_MOVEMENT * du;
        }

    }

    // Handle firing
    this.maybeFireBullet();

    if(this.isColliding()) {
        const hitEntity = this.findHitEntity();
        const canTakeHit = hitEntity.collision;
        if (canTakeHit) {
            userInterface.loseHealth();
            canTakeHit.call(hitEntity);
        }
    }else {
        spatialManager.register(this);
    }
};

Ship.prototype.maybeFireBullet = function () {

    if (keys[this.KEY_FIRE]) {

        const dX = +Math.sin(this.rotation);
        const dY = -Math.cos(this.rotation);
        const launchDist = this.getRadius() * 1.2;

        const relVel = this.launchVel;
        const relVelX = dX * relVel;
        const relVelY = dY * relVel;

        entityManager.fireBullet(
           this.cx + dX * launchDist, this.cy + dY * launchDist,
           this.velX + relVelX, relVelY,
           this.rotation);

        if(this.powerUpBullet) {
            entityManager.fireBullet(
                this.cx+this.getRadius() + dX * launchDist, this.cy + dY * launchDist,
                this.velX + 0.5 + relVelX, relVelY,
                this.rotation);
            entityManager.fireBullet(
                this.cx-this.getRadius() + dX * launchDist, this.cy + dY * launchDist,
                this.velX - 0.5 - relVelX, relVelY,
                this.rotation);
        }

    }
};

Ship.prototype.getRadius = function () {
    return this._scale*(this.sprite.height / 2) * 0.9;
};

Ship.prototype.takeBulletHit = function () {
    userInterface.loseHealth();
    entityManager.generateSpawn({
        cx : this.cx,
        cy : this.cy,
        _scale : this._scale/2,
        sprite : this.sprite
    });
    playSound(g_sounds.shipColliding);
};

Ship.prototype.reset = function () {
    this.setPos(this.reset_cx, this.reset_cy);
    this.rotation = this.reset_rotation;
    this.halt();
};

Ship.prototype.halt = function () {
    this.velX = 0;
    this.velY = 0;
};

Ship.prototype.render = function (ctx) {
    const origScale = this.sprite.scale;
    // pass my scale into the sprite, for drawing
    this.sprite.scale = this._scale;
    this.sprite.drawCentredAt(
	ctx, this.cx, this.cy, this.rotation
    );
    this.sprite.scale = origScale;
};