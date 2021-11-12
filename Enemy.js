// ==========
// ENEMY STUFF
// ==========

function Enemy(number, spawnLocation, type, manoeuvre) {
	
    this.initialize(number, spawnLocation);
	
	this._type = type;
	
	this._manoeuvre = manoeuvre;
	
	this.sprite = g_sprites.bee;
	
	this.width = g_sprites.bee.width;

	this._scale = 0.5;

	// Path related
	this._numberInLine = number;

	this._spawnPoint = spawnLocation - 1;
	
	//this._path = path;

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
Enemy.prototype.velX = 0;
Enemy.prototype.velY = 0;
Enemy.prototype.waitT = 16;

Enemy.prototype.update = function (du) {
	
	let oldX = this.cx;
	let oldY = this.cy;
	
	spatialManager.unregister(this);
    if(this._isDeadNow){
        return entityManager.KILL_ME_NOW;
    }
	
	// waitT is the number of updates enemy skips after being
	// created before starting to follow path
	if (this._wait) this.waitT -= 1;

	if (this._onPath) {
		this.followPath(du);
		
		this.velX = oldX - this.cx;
		this.velY = oldY - this.cy;
	}
	else {	
	
		this.cx += this.velX * du;
		this.cy += this.velY * du;
	}
	
	spatialManager.register(this);
};

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
			
			// Give enemies speed boost when they leave path
			// if needed
			if (this.velX > -10 && this.velX < 0) {
				this.velX *= 2;
			}
			else if (this.velX < 10) {
				this.velX *= 2;
			}
			
			if (this.velY > -10 && this.velY < 0) {
				this.velY *= 2;
			}
			else if (this.velY < 10) {
				this.velY *= 2;
			}
			
			this.cx += this.velX * du;
			this.cy += this.velY * du;
		} else {
			this.cx = nextPoint.x;
			this.cy = nextPoint.y;
		}
		this._pointN += 1;
	}
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

// Kill enemies that have 'fled' too far away
Enemy.prototype.outOfBounds = function (x, y) {
	
	if (x < -100 || x > g_canvas.width + 100 ||
		y < -100 || y > g_canvas.width + 100) {
		
		this.kill();
	}
};
Enemy.prototype.takeBulletHit = function(){
	console.log("TAKInG HIT OOOMG");

		this._spawnFragment();

};

Enemy.prototype._spawnFragment = function(){
	this._isDeadNow = true;
	console.log("ætti að hverfa held ég...");
};

Enemy.prototype.getRadius = function(){
	return (this.sprite.width/4);
};
