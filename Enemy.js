// ==========
// ENEMY STUFF
// ==========

function Enemy(descr) {

	this.setup(descr);
	
    this.initialize(this._numberInLine, this._spawnPoint);
	
	//this._manoeuvre = manoeuvre;
	
	this.sprite = g_sprites.bee;
	
	this.width = g_sprites.bee.width;

	this._scale = 0.5;

	// Path related


	this._manoN = 0;
	
	this._pointN = 0;
	
	this._onPath = true;
	
	this._wait = true;

}

Enemy.prototype = new Entity();

// Initial, inheritable, default values
Enemy.prototype.rotation = 0;
Enemy.prototype.cx = -10;
Enemy.prototype.cy = -10;
Enemy.prototype.velX = -4;
Enemy.prototype.velY = 4;
Enemy.prototype.waitT = 16;

Enemy.prototype._type = null;
Enemy.prototype._numberInLine = null;
Enemy.prototype._spawnPoint = null;
Enemy.prototype._path = null;

Enemy.prototype.update = function (du) {
	
	spatialManager.unregister(this);

	if(this._isDeadNow){
        return entityManager.KILL_ME_NOW;
    }
	
	// waitT is the number of updates enemy skips after being
	// created before starting to follow path
	if (this._wait) this.waitT -= 1;
	
	if (this._onPath) {
		this.followPath(du);
	}
	else {
		this.cx += this.velX * du;
		this.cy += this.velY * du;
	}
	//Þarf að útfæra betur
	//this.maybeShootBullet();
	spatialManager.register(this);
};

Enemy.prototype.getRadius = function() {
	return this._scale*(this.sprite.width / 2) * 0.9;
}

// TODO: this._pointN must be set equal to number of points generated
// 		 for this implementation to work. FIX!
Enemy.prototype.followPath = function(du) {
	
	if (this.waitT <= 0) this._wait = false;
	
	if (!this._wait) {
		if (this._pointN >= 200) {
			this._pointN -= 200;
			this._manoN += 1;
		}
		let nextPoint = paths.getPathPoint(
			this._spawnPoint, 
			this._manoN, 
			this._pointN);
			
			
		if (nextPoint === 0) {
			this._onPath = false;
			this.cx += this.velX * du;
			this.cy += this.velY * du;
		} else {
			this.cx = nextPoint.x;
			this.cy = nextPoint.y;
		}
		this._pointN += 1;
	}
};

Enemy.prototype.takeBulletHit = function () {
    this.kill();
	userInterface.score +=100;
};

Enemy.prototype.initialize = function (number, spawnLocation) {
	let offset = number * g_sprites.ship2.width + 16;
	this.waitT = this.waitT * number;
	
	switch (spawnLocation) {
		case 1:
			this.cx = 200;
			this.cy = 0 - offset;
			this.velX = 0;
			this.velY = 4;
			break;
		case 2:
			this.cx = 400;
			this.cy = 0 - offset;
			this.velX = 0;
			this.velY = 4;
			break;
		case 3:
			this.cx = 0 - offset;
			this.cy = 400;
			this.velX = 4;
			this.velY = 0;
			break;
		case 4:
			this.cx = g_canvas.width + offset;
			this.cy = 400;
			this.velX = -4;
			this.velY = 0;
	}
};

Enemy.prototype.render = function (ctx) {
	let origScale = this.sprite.scale;
	this.sprite.scale = this._scale;
	this.sprite.drawCentredAt(
	ctx, this.cx, this.cy, this.rotation
	);
	this.sprite.scale = origScale;
};

//TODO: á í rauninni eftir að útfæra þetta alveg heh þarf ehv annað en chance útfærsluna
Enemy.prototype.maybeShootBullet = function() {
	if (!this._isDeadNow) {
		let chance = Math.random();
		if (chance < 0.33) {
			entityManager.fireEnemyBullet(this.cx, this.cy, this.velX, this.velY);
		}

	}
};
