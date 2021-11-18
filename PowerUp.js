// ==========
// POWER UP STUFF
// ==========

function PowerUp(descr) {
    this.entityType = "powerUp";

    this.setup(descr);
    this.sprite = this.sprite || g_sprites.purpleRock;
    this.randomisePosition();
    this.randomiseVelocity();

    this.hasBeenHit = this.hasBeenHit || false;
    this._scale = this._scale || 1;
}

PowerUp.prototype = new Entity();
PowerUp.prototype.lifeSpan = 5000 / NOMINAL_UPDATE_INTERVAL;

PowerUp.prototype.update = function (du) {
    if (!this.isSpawn) {
        spatialManager.unregister(this);

        if(this._isDeadNow){
            return entityManager.KILL_ME_NOW;
        }

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
        //unregister first
        if (this.spawnIsReg) {
            spatialManager.unregister(this);
            this.spawnIsReg = false;
        }

        this.lifeSpan -= du;

        if (this.lifeSpan < 0 ) {
            //only big yellow spawns can change bullet type
            if (this.sprite === g_sprites.yellowRock && this._scale > 0.5) {
                const ship = entityManager._findNearestShip(0, 0);
                if (ship.powerUpBullet) {
                    ship.powerUpBullet = false;
                }
            }
            return entityManager.KILL_ME_NOW;
        }

        //only small spawns move
        if (this._scale <= 0.5) {
            this.cx += this.velX * du;
            this.cy += this.velY * du;
        }
    }
};

PowerUp.prototype.getRadius = function() {
    return this.sprite.scale*(this.sprite.width / 2) * 0.9;
}

PowerUp.prototype.collision = function () {
    this.kill();
    playSound(g_sounds.shipColliding);
    if (this._scale > 0.5) {
        let n = Math.round(util.randRange(4,7));
        for (let i = 0; i < n; i++) {
            this.spawn({
                cx : this.cx,
                cy : this.cy,
                _scale : this._scale/2,
                lifeSpan : PowerUp.prototype.lifeSpan/10,
                sprite : this.sprite,
                isSpawn : true,
                spawnIsReg : true
            });
        }
    }
}


PowerUp.prototype.takeBulletHit = function () {
    this.kill();
    playSound(g_sounds.rockSplit);
    if (this._scale > 0.5) {
        let n = Math.round(util.randRange(4,7));
        for (let i = 0; i < n; i++) {
            this.spawn({
                cx : this.cx,
                cy : this.cy,
                _scale : this._scale/2,
                lifeSpan : PowerUp.prototype.lifeSpan/10,
                sprite : this.sprite,
                isSpawn : true,
                spawnIsReg : true
            });
        }
    }
    this.checkType();
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
    userInterface.increaseScoreFromPowerUp();
};

PowerUp.prototype.yellow = function() {
    const ship = entityManager._findNearestShip(0, 0);
    if (!ship.powerUpBullet) {
        ship.powerUpBullet = true;
    }
    this.spawn({
        sprite : this.sprite,
        cx : g_canvas.width-this.sprite.width/2,
        cy : g_canvas.height-this.sprite.height/2,
        velX : 0,
        velY : 0,
        rotation : 0,
        isSpawn : true,
        spawnIsReg : true
    });
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