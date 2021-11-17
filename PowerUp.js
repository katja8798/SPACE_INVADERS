// ==========
// POWER UP STUFF
// ==========

function PowerUp(descr) {

    this.setup(descr);
    this.sprite = this.sprite || g_sprites.purpleRock;
    this.randomisePosition();
    this.randomiseVelocity();

    this.hasBeenHit = this.hasBeenHit || false;
    this._scale = this._scale || 1;
    this.isSpawn = this.isSpawn || false;
    this.spawnIsReg = true;

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

PowerUp.prototype.randomisePosition = function () {
    let chance = Math.random(),
        x,
        y;

    //always appear from random edges
    if (chance < 0.33) {//left edge
        x = -this.getRadius();
        y = Math.random() * g_canvas.height/3*2;//always appear above ship
    } else if (chance < 0.66) {//right edge
        x = g_canvas.width + this.getRadius();
        y = Math.random() * g_canvas.height/3*2;//always appear above ship
    }
    else if (chance < 1) {//top edge
        x = Math.random() * g_canvas.width;
        y = -this.getRadius();
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
    const MIN_SPEED = 60,
        MAX_SPEED = 90;

    const speed = util.randRange(MIN_SPEED, MAX_SPEED) / SECS_TO_NOMINALS;
    const dirn = Math.random() * consts.FULL_CIRCLE;

    this.velX = this.velX || speed * Math.cos(dirn);
    this.velY = this.velY || speed * Math.sin(dirn);

    const MIN_ROT_SPEED = 4.5,
        MAX_ROT_SPEED = 5.5;

    this.velRot = this.velRot ||
        util.randRange(MIN_ROT_SPEED, MAX_ROT_SPEED) / SECS_TO_NOMINALS;
};


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

PowerUp.prototype.spawn = function (descr) {
    entityManager.generatePowerUp(descr);
}

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
    const ship = entityManager._findNearestShip(0, 0).theShip;
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