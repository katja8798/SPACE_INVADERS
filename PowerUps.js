// ==========
// POWER UP STUFF
// ==========

function PowerUps(descr) {

    this.setup(descr);

}

PowerUps.prototype = new Entity();

// Initial, inheritable, default values

PowerUps.prototype.update = function (du) {

    spatialManager.unregister(this);

    if(this._isDeadNow){
        return entityManager.KILL_ME_NOW;
    }

    spatialManager.register(this);
};

PowerUps.prototype.getRadius = function() {
    return (this.sprite.width / 2) * 0.9;
}

PowerUps.prototype.takeBulletHit = function () {
    this.kill();
};

PowerUps.prototype.render = function (ctx) {
    let origScale = this.sprite.scale;
    this.sprite.scale = this._scale;
    this.sprite.drawCentredAt(
        ctx, this.cx, this.cy, this.rotation
    );
    this.sprite.scale = origScale;
};
