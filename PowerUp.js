// ==========
// POWER UP STUFF
// ==========

function PowerUp(descr) {
    this.entityType = "powerUp";

    this.setup(descr);
    this.sprite = this.sprite || g_sprites.purpleRock;
    this.randomisePosition();
    this.randomiseVelocity();

    this.hasBeenHit = false;
    this._scale = this._scale || 1;
    this.isReg = true;
}

PowerUp.prototype = new Entity();
PowerUp.prototype.lifeSpan = 5000 / NOMINAL_UPDATE_INTERVAL;

PowerUp.prototype.update = function (du) {
    if (!this.hasBeenHit) {
        spatialManager.unregister(this);

        if (this._isDeadNow) {
            return entityManager.KILL_ME_NOW;
        }

        //Kill if it reaches the edge
        if (this.cy < 0 - this.getRadius() || this.cy > g_canvas.height + this.getRadius() ||
            this.cx < 0 - this.getRadius() || this.cx > g_canvas.width + this.getRadius()) {
            return entityManager.KILL_ME_NOW;
        }

        this.cx += this.velX * du;
        this.cy += this.velY * du;
        this.rotation += 1 * this.velRot;

        spatialManager.register(this);
    }
    else {
        if (this.isReg) {
            spatialManager.unregister(this);
            this.isReg = false;
        }

        this.lifeSpan -= du;

        if (this.lifeSpan < 0 ) {
            //only big yellow spawns can change bullet type
            if (this.sprite === g_sprites.yellowRock) {
                const ship = entityManager._findNearestShip(0, 0);
                if (ship.powerUpBullet) {
                    ship.powerUpBullet = false;
                }
            }
            return entityManager.KILL_ME_NOW;
        }
    }
};

PowerUp.prototype.getRadius = function() {
    return this.sprite.scale*(this.sprite.width / 2) * 0.9;
}

PowerUp.prototype.collision = function () {
    playSound(g_sounds.shipColliding);
    entityManager.generateSpawn({
        cx : this.cx,
        cy : this.cy,
        _scale : this._scale/2,
        sprite : this.sprite
    });
    this.kill();
}


PowerUp.prototype.takeBulletHit = function () {
    playSound(g_sounds.rockSplit);
    entityManager.generateSpawn({
        cx : this.cx,
        cy : this.cy,
        _scale : this._scale/2,
        sprite : this.sprite
    });
    this.checkType();
};

PowerUp.prototype.checkType = function () {
  switch (this.sprite) {
      case g_sprites.purpleRock:
          this.kill();
          this.purple();
          break;
      case g_sprites.greenRock:
          this.kill();
          this.green();
          break;
      case g_sprites.yellowRock:
          this.hasBeenHit = true;
          this.yellow();
          break;
      default:
          this.kill();
          this.purple();
  }
};

PowerUp.prototype.purple = function() {
    userInterface.increaseScoreFromPowerUp();
};

PowerUp.prototype.yellow = function() {
    const ship = entityManager._findNearestShip(0, 0);
    if (!ship.powerUpBullet) {
        ship.powerUpBullet = true;
    }
    this.cx = g_canvas.width-this.sprite.width/2;
    this.cy = g_canvas.height-this.sprite.height/2;
    this.velX = 0;
    this.velY = 0;
    this.rotation = 0;
};

PowerUp.prototype.green = function() {
    userInterface.gainHealth();
};

PowerUp.prototype.render = function (ctx) {

    ctx.save();
    let fadeThresh = PowerUp.prototype.lifeSpan/3;

    if((this.sprite === g_sprites.yellowRock || this.isSpawn) && fadeThresh > this.lifeSpan) {
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