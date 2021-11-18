// ==========
// ENEMY STUFF
// ==========

// A generic constructor which accepts an arbitrary descriptor object
function Enemy(descr) {

	this.entityType = "enemy"

	this.setup(descr);

	this._scale = .5;

	this._health = 1;

	this.initialize(this._numberInLine, this._spawnPoint, this._type);

	// Path related

	this._pointsMax = paths.getPointsPerCurve();

	this._manoN = 0;

	this._pointN = 0;

	this._onPath = true;

	this._wait = true;

	// Formation related
	this._myCell = 0;

	this._formation = true;

	this._inFormation = false;

}

Enemy.prototype = new Entity();

// Initial, inheritable, default values
Enemy.prototype.rotation = 0;
Enemy.prototype.cx = 300;
Enemy.prototype.cy = -10;
Enemy.prototype.velX = 0;
Enemy.prototype.velY = 0;
Enemy.prototype.waitT = 16;

Enemy.prototype._type = null;
Enemy.prototype._numberInLine = null;
Enemy.prototype._spawnPoint = null;
Enemy.prototype._manoeuvre = null;


Enemy.prototype.update = function (du) {
	
	let oldX = this.cx;
	let oldY = this.cy;

	spatialManager.unregister(this);

    if(this._isDeadNow){
		if (this._myCell !== 0) {
			formation.returnCell(this._myCell);
		}
        return entityManager.KILL_ME_NOW;
    }
	
	// waitT is the number of updates enemy skips after being
	// created before starting to follow path
	if (this._wait) this.waitT -= 1;

	// If on a path: get next path coordinates
	if (this._onPath) {
		this.followPath(du);

		if(this._onPath) {
			this.velX = oldX - this.cx;
			this.velY = oldY - this.cy;
		}
	}

	else if (this._formation) {
		this.goToFormation(this._myCell, du);
	}

	if (!this._formation) {

		this.cx += this.velX * du;
		this.cy += -this.velY * du;
		this.outOfBounds(this.cx, this.cy);
	}
	
	this.maybeShootBullet();

	spatialManager.register(this);
};

Enemy.prototype.getRadius = function() {
	return this._scale*(this.sprite.width / 2) * 0.9;
}
//Makes the Enemy follow the given path
Enemy.prototype.followPath = function(du) {

	if (this.waitT <= 0) this._wait = false;

	if (!this._wait) {
		if (this._pointN >= this._pointsMax) {
			this._pointN -= this._pointsMax;
			this._manoN += 1;
		}
		let nextPoint = paths.getPathPoint(
			this._spawnPoint,
			this._manoeuvre,
			this._manoN,
			this._pointN);


		// If path has ended: go to formation or leave area
		if (nextPoint === 0) {
			this._onPath = false;

			// Velocity can be too low when leaving path
			//this.adjustSpeed();

			// If formation is active: reserve an empty cell
			if (this._formation) {
				let reservedCell = formation.getEmptyCell(this._type);
				if (reservedCell === 0) {
					this._formation = false;
				}
				else {
					this._myCell = reservedCell;
				}
			}
			else {
				this.cx += this.velX * du;
				this.cy += this.velY * du;
			}
		}

		// If still on path: go to next point
		else {
			this.cx = nextPoint.x;
			this.cy = nextPoint.y;
		}
		this._pointN += 1;
	}
};

Enemy.prototype.collision = function () {
	playSound(g_sounds.enemyHit);
	entityManager.generateSpawn({
		cx : this.cx,
		cy : this.cy,
		_scale : this._scale/2,
		sprite : this.sprite
	});
	this.kill();
	levelManager.enemyKilled();
};

Enemy.prototype.takeBulletHit = function () {
	this._health--;
	playSound(g_sounds.enemyHit);

	if (this._health <= 0) {
		entityManager.generateSpawn({
			cx : this.cx,
			cy : this.cy,
			_scale : this._scale/2,
			sprite : this.sprite
		});
		this.kill();
		userInterface.increaseScore(this._type);
		levelManager.enemyKilled();
	}
};

// Increase enemy velocity if too low
Enemy.prototype.adjustSpeed = function () {
	if (this.velX < -6 || this.velX > 6) {
		this.velX /= 3;
	}
	else if (this.velX > -2 && this.velX < 2){
		this.velX *= 2;
	}
	if (this.velY < -6 || this.velY > 6) {
		this.velY /= 3;
	}
	else if (this.velY > -2 && this.velY < 2) {
		this.velY *= 2;
	}
};

// Seek coordinates of reserved cell in formation
Enemy.prototype.goToFormation = function (cellID, du) {
	let cellCoordinates = formation.getCellCoordinates(cellID);
	let targetX = cellCoordinates.cx;
	let targetY = cellCoordinates.cy;

	// If enemy is already within cell, stay in cell
	if (this._inFormation) {
		this.cx = targetX;
		this.cy = targetY;
	}

	else {
		let dx = targetX - this.cx;
		let dy = targetY - this.cy;

		let velocity = Math.sqrt(Math.sqrt(util.square(this.velX)+ util.square(this.velY)));
		let distance = Math.sqrt(util.distSq(this.cx, this.cy, targetX, targetY));

		if (distance < 5) {
			this._inFormation = true;
			this.cx = targetX;
			this.cy = targetY;
		}
		else {
			this.cx += velocity * du * dx / distance;
			this.cy += velocity * du * dy / distance;
		}
	}
};

// Adjust various variables based on spawn point & type
Enemy.prototype.initialize = function (number, spawnLocation, type) {
	this._type = type;

	if (type === 2) {
		this.sprite = g_sprites.butterfly;
		this.width = g_sprites.butterfly.width;
		this._scale = g_sprites.butterfly.scale;
	} 

	else if (type === 3) {
		this.sprite = g_sprites.boss;
		this._scale = g_sprites.boss.scale;
		this.width = g_sprites.boss.width;
		this._health = 2;
	}

	else if (type === 4) {
		this.sprite = g_sprites.purpleBoss;
		this._scale = g_sprites.purpleBoss.scale;
		this.width = g_sprites.purpleBoss.width;
		this._health = 3;
	}
	else {
		this.sprite = g_sprites.bee;
		this.width = g_sprites.bee.width;
	}

	let offset = number * g_sprites.ship2.width + 16;
	this.waitT = this.waitT * number * type;

	
	switch (spawnLocation) {
		case 0:
			this.cx = 200;
			this.cy = 0 - offset;
			this.velX = 0;
			this.velY = 4;
			break;
		case 1:
			this.cx = 400;
			this.cy = 0 - offset;
			this.velX = 0;
			this.velY = 4;
			break;
		case 2:
			this.cx = 0 - offset;
			this.cy = 400;
			this.velX = 4;
			this.velY = 0;
			if (this._manoeuvre === 1) this.waitT *= 3;
			break;
		case 3:
			this.cx = g_canvas.width + offset;
			this.cy = 400;
			this.velX = -4;
			this.velY = 0;
			if (this._manoeuvre === 1) this.waitT *= 3;
			break;
		case 4:
			this.cx = 0 - offset;
			this.cy = 200;
			this.velX = 4;
			this.velY = 0;
			break;
		case 5:
			this.cx = g_canvas.width + offset;
			this.cy = 200;
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

// Kill enemies that have 'fled' too far away
Enemy.prototype.outOfBounds = function (x, y) {

	if (x < -400 || x > g_canvas.width + 400 ||
		y < -400 || y > g_canvas.width + 400) {

		this.kill();
		levelManager.enemyKilled();
	}
};


Enemy.prototype.maybeShootBullet = function() {

	if (!this._isDeadNow) {
		var fire = util.randRange(1,100);
		if (fire<40){
			if (levelManager.canFireBullet() && this.cy < 500) {
				entityManager.fireEnemyBullet(this.cx, this.cy, -this.velX, 5);
				levelManager.shotFired();
			}
		}
	}
};