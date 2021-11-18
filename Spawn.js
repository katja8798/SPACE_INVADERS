// ==========
// POWER UP STUFF
// ==========

function Spawn(descr) {
    this.entityType = "Spawn";

    this.setup(descr);
    this.sprite = this.sprite || g_sprites.heart;
    this._scale = this._scale || 1;
    this.randomisePosition();
    this.randomiseVelocity();
}

Spawn.prototype = new Entity();
Spawn.prototype.lifeSpan = 1000 / NOMINAL_UPDATE_INTERVAL;

Spawn.prototype.update = function (du) {

    this.lifeSpan -= du;

    if (this.lifeSpan < 0 ) {
        return entityManager.KILL_ME_NOW;
    }

    this.cx += this.velX * du;
    this.cy += this.velY * du;
};



Spawn.prototype.render = function (ctx) {
    ctx.save();
    let fadeThresh = Spawn.prototype.lifeSpan/3;

    if(fadeThresh > this.lifeSpan) {
        ctx.globalAlpha = this.lifeSpan / fadeThresh;
    }

    let origScale = this.sprite.scale;
    this.sprite.scale = this._scale;
    this.sprite.drawCentredAt(
        ctx, this.cx, this.cy, this.rotation
    );
    this.sprite.scale = origScale;
    ctx.restore();
};