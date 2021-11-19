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
    this.init();

}

Bullet.prototype = new Entity();
    
// Initial, inheritable, default values
Bullet.prototype.cx = 200;
Bullet.prototype.cy = 200;
Bullet.prototype.velX = 5;
Bullet.prototype.velY = 5;
Bullet.prototype.entityType = "bullet";

// For glow & particle effects
Bullet.prototype.effects = {};
Bullet.prototype.type = 0;
Bullet.prototype.color = consts.COLORS.RED;

Bullet.prototype.update = function (du) {

    spatialManager.unregister(this);
    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }

    if (this.cy <= 0) {
        return entityManager.KILL_ME_NOW;
    }
    let oldX = this.cx;
    let oldY = this.cy;

    this.cx += this.velX * du;
    this.cy += this.velY * du;

    //
    // Handle collisions
    //
    const hitEntity = this.findHitEntity();

    if ((hitEntity.entityType === "enemy" && this.sprite === g_sprites.bullet) ||//bullet shoots enemy
        (hitEntity.entityType === "powerUp" && this.sprite === g_sprites.bullet) ||//bullet shoot power up
        (hitEntity.entityType === "ship" && this.sprite === g_sprites.enemyBullet) ||//enemy bullet shoots ship
        (hitEntity.entityType === "bullet" && this.sprite === g_sprites.bullet)) {//bullet shoots bullet
        const canTakeHit = hitEntity.takeBulletHit;
        if (canTakeHit) canTakeHit.call(hitEntity);
        return entityManager.KILL_ME_NOW;
    }else {
        spatialManager.register(this);
    }
    this.updateEffects(oldX, oldY);
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

    this.renderEffects(ctx);
    ctx.globalAlpha = 1;
};

Bullet.prototype.init = function() {
    if (this.type === 1) {
        this.color = consts.COLORS.BLUE;
    }
    else {
        this.velX = util.getRandomInt(this.velX, -this.velX);
    }

    this.effects = {
        eX : this.cx,
        eY : this.cy
    }
};

Bullet.prototype.updateEffects = function(x, y) {
    this.effects.eX = x;
    this.effects.eY = y;
};

Bullet.prototype.renderEffects = function(ctx) {
    ctx.save();
    ctx.shadowBlur = 20;
    ctx.shadowColor = 'rgb(' + this.color + ')';
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = 'rgb(' + this.color + ')';
    ctx.beginPath();
    ctx.arc(this.effects.eX, this.effects.eY, 5, 0, Math.PI *2);
    ctx.fill();
    ctx.restore();

};
