// ==========
// POWER UP STUFF
// ==========

function PowerUp(descr) {

    this.setup(descr);

    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.purpleRock;

    this.randomisePosition();
    this.randomiseVelocity();

    // Set normal drawing scale, and warp state off
    this._scale = 1;

}

PowerUp.prototype = new Entity();

// Initial, inheritable, default values
PowerUp.prototype.rotation = 0;
PowerUp.prototype.cx = 200;
PowerUp.prototype.cy = 200;
PowerUp.prototype.velX = 0;
PowerUp.prototype.velY = 0;
PowerUp.prototype.lifeSpan = 3000 / NOMINAL_UPDATE_INTERVAL;
PowerUp.prototype.hasBeenHit = false;

PowerUp.prototype.update = function (du) {

    if (!this.hasBeenHit) {
        spatialManager.unregister(this);

        this.cx += this.velX * du;
        this.cy += this.velY * du;
        this.rotation += 1 * this.velRot;

        spatialManager.register(this);
    }
    else {
        this.lifeSpan -= du;
        if (this.lifeSpan < 0){
            return entityManager.KILL_ME_NOW;
        }
    }
};

var NOMINAL_ROTATE_RATE = 0.1;


PowerUp.prototype.getRadius = function() {
    return this._scale*(this.sprite.width / 2) * 0.9;
}

PowerUp.prototype.randomisePosition = function () {
    // Rock randomisation defaults (if nothing otherwise specified)
    this.cx = this.cx || Math.random() * g_canvas.width;
    this.cy = this.cy || Math.random() * g_canvas.height;
    this.rotation = this.rotation || 0;
};

PowerUp.prototype.randomiseVelocity = function () {
    var MIN_SPEED = 20,
        MAX_SPEED = 70;

    var speed = util.randRange(MIN_SPEED, MAX_SPEED) / SECS_TO_NOMINALS;
    var dirn = Math.random() * consts.FULL_CIRCLE;

    this.velX = this.velX || speed * Math.cos(dirn);
    this.velY = this.velY || speed * Math.sin(dirn);

    var MIN_ROT_SPEED = 0.5,
        MAX_ROT_SPEED = 2.5;

    this.velRot = this.velRot ||
        util.randRange(MIN_ROT_SPEED, MAX_ROT_SPEED) / SECS_TO_NOMINALS;
};

PowerUp.prototype.takeBulletHit = function () {
    this.hit = true;
    this.cx = g_canvas.width-this.sprite.width;
    this.cy = g_canvas.height-this.sprite.height;
    this.velX = 0;
    this.velY = 0;
    this.countDown();

    //TODO add so it makes changes a.k.a. power ups
};

PowerUp.prototype.countDown = function() {

};

PowerUp.prototype.render = function (ctx) {
    let origScale = this.sprite.scale;
    this.sprite.scale = this._scale;
    this.sprite.drawCentredAt(
        ctx, this.cx, this.cy, this.rotation
    );
    this.sprite.scale = origScale;
};
/*

Rock.prototype.update = function (du) {

    spatialManager.unregister(this);
    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }

    this.cx += this.velX * du;
    this.cy += this.velY * du;

    this.rotation += 1 * this.velRot;
    this.rotation = util.wrapRange(this.rotation,
        0, consts.FULL_CIRCLE);

    this.wrapPosition();

    spatialManager.register(this);
};

Rock.prototype.getRadius = function () {
    return this.scale * (this.sprite.width / 2) * 0.9;
};

Rock.prototype.takeBulletHit = function () {
    this.kill();

    if (this.scale > 0.25) {
        this._spawnFragment();
        this._spawnFragment();

        this.splitSound.play();
    } else {
        this.evaporateSound.play();
    }
};

Rock.prototype._spawnFragment = function () {
    entityManager.generateRock({
        cx : this.cx,
        cy : this.cy,
        scale : this.scale /2
    });
};

Rock.prototype.render = function (ctx) {
    var origScale = this.sprite.scale;
    // pass my scale into the sprite, for drawing
    this.sprite.scale = this.scale;
    this.sprite.drawWrappedCentredAt(
        ctx, this.cx, this.cy, this.rotation
    );
};
*/