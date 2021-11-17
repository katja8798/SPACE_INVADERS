// ======
// BULLET
// ======

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic constructor which accepts an arbitrary descriptor object
function Bullet(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);
    this.sprite = this.sprite || g_sprites.bullet;

    // Make a noise when I am created (i.e. fired)
    playSound(g_sounds.bulletFire);

/*
    // Diagnostics to check inheritance stuff
    this._bulletProperty = true;
    console.dir(this);
*/

}

Bullet.prototype = new Entity();
    
// Initial, inheritable, default values
Bullet.prototype.cx = 200;
Bullet.prototype.cy = 200;
Bullet.prototype.velX = 5;
Bullet.prototype.velY = 5;
Bullet.prototype.entityType = "bullet";

Bullet.prototype.update = function (du) {

    spatialManager.unregister(this);
    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }

    if (this.cy <= 0) {
        return entityManager.KILL_ME_NOW;
    }

    this.cx += this.velX * du;
    this.cy += this.velY * du;

    //
    // Handle collisions
    //
    const hitEntity = this.findHitEntity();

    if ((hitEntity.entityType === "enemy" && this.sprite === g_sprites.bullet) ||//ship shoots enemy
        (hitEntity.entityType === "powerUp" && this.sprite === g_sprites.bullet) ||//ship shoot power up
        (hitEntity.entityType === "ship" && this.sprite === g_sprites.enemyBullet)) {//enemy shoots ship
        const canTakeHit = hitEntity.takeBulletHit;
        if (canTakeHit) canTakeHit.call(hitEntity);
        return entityManager.KILL_ME_NOW;
    }
    spatialManager.register(this);
};

Bullet.prototype.getRadius = function () {
    return 4;
};

Bullet.prototype.takeBulletHit = function () {
    this.kill();
    
    // Make a noise when I am zapped by another bullet
    playSound(g_sounds.bulletZapped);
};

Bullet.prototype.render = function (ctx) {
    this.sprite.drawCentredAt(
        ctx, this.cx, this.cy, 0
    );

    ctx.globalAlpha = 1;
};
