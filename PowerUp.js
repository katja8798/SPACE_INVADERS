// ==========
// POWER UP STUFF
// ==========

function PowerUp(descr) {

    this.setup(descr);

}

PowerUp.prototype = new Entity();

// Initial, inheritable, default values

PowerUp.prototype.update = function (du) {

    spatialManager.unregister(this);

    if(this._isDeadNow){
        return entityManager.KILL_ME_NOW;
    }

    spatialManager.register(this);
};

PowerUp.prototype.getRadius = function() {
    return (this.sprite.width / 2) * 0.9;
}

PowerUp.prototype.takeBulletHit = function () {
    this.kill();
};

PowerUp.prototype.render = function (ctx) {
    let origScale = this.sprite.scale;
    this.sprite.scale = this._scale;
    this.sprite.drawCentredAt(
        ctx, this.cx, this.cy, this.rotation
    );
    this.sprite.scale = origScale;
};
