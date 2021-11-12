// ==========
// POWER UP STUFF
// ==========

function PowerUp(descr) {

    this.setup(descr);
    //this.powerUpType();
    this.sprite = this.sprite || g_sprites.purpleRock;
    this.randomisePosition();
    this.randomiseVelocity();

    this.lifeSpan = 6000 / NOMINAL_UPDATE_INTERVAL;
    this.hasBeenHit = false;
    this._scale = 1;

}

PowerUp.prototype = new Entity();

PowerUp.prototype.update = function (du) {
    if (!this.hasBeenHit) {
        spatialManager.unregister(this);

        //Kill if it reaches the edge
        if (this.cy < 0-this.getRadius() || this.cy > g_canvas.height+this.getRadius() ||
            this.cx < 0-this.getRadius() || this.cx > g_canvas.width+this.getRadius()){
            return entityManager.KILL_ME_NOW;
        }

        this.cx += this.velX * du;
        this.cy += this.velY * du;
        this.rotation += 1 * this.velRot;

        spatialManager.register(this);
    }
    else {
        this.lifeSpan -= du;
        if (this.lifeSpan < 0 ||
            this.sprite === g_sprites.purpleRock ||
            this.sprite === g_sprites.greenRock){
            return entityManager.KILL_ME_NOW;
        }
    }
};

PowerUp.prototype.getRadius = function() {
    return this._scale*(this.sprite.width / 2) * 0.9;
}

PowerUp.prototype.randomisePosition = function () {
    let chance = Math.random(),
        x,
        y;

    //always appear from random edges
    if (chance < 0.33) {//left edge
        x = 0;
        y = Math.random() * g_canvas.height/3*2;//always appear above ship
    } else if (chance < 0.66) {//right edge
        x = g_canvas.width;
        y = Math.random() * g_canvas.height/3*2;//always appear above ship
    }
    else if (chance < 1) {//top edge
        x = Math.random() * g_canvas.width;
        y = 0;
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

PowerUp.prototype.randomiseVelocity = function () {
    const MIN_SPEED = 20,
        MAX_SPEED = 70;

    const speed = util.randRange(MIN_SPEED, MAX_SPEED) / SECS_TO_NOMINALS;
    const dirn = Math.random() * consts.FULL_CIRCLE;

    this.velX = this.velX || speed * Math.cos(dirn);
    this.velY = this.velY || speed * Math.sin(dirn);

    const MIN_ROT_SPEED = 1.5,
        MAX_ROT_SPEED = 3.5;

    this.velRot = this.velRot ||
        util.randRange(MIN_ROT_SPEED, MAX_ROT_SPEED) / SECS_TO_NOMINALS;
};


PowerUp.prototype.takeBulletHit = function () {
    this.hasBeenHit = true;
    spatialManager.unregister(this);
    this.checkType();
    this.cx = g_canvas.width-this.sprite.width;
    this.cy = g_canvas.height-this.sprite.height;
    this.velX = 0;
    this.velY = 0;
    this.rotation = 0;
};

PowerUp.prototype.checkType = function () {
  switch (this.sprite) {
      case g_sprites.purpleRock:
          this.purple();
          break;
      case g_sprites.greenRock:
          this.green();
          break;
      case g_sprites.yellowRock:
          this.yellow();
          break;
      default:
          this.purple();
  }
};

PowerUp.prototype.purple = function() {
    userInterface.changeScore();
};

PowerUp.prototype.yellow = function() {
    //TODO add ship speed
};

PowerUp.prototype.green = function() {
    userInterface.gainHealth();
};

PowerUp.prototype.render = function (ctx) {

    let origScale = this.sprite.scale;
    this.sprite.scale = this._scale;
    this.sprite.drawCentredAt(
        ctx, this.cx, this.cy, this.rotation
    );
    this.sprite.scale = origScale;
};