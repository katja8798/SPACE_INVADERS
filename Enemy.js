// ==========
// ENEMY STUFF
// ==========

function Enemy(number, spawnLocation, type, manoeuvre) {
	
    this.initialize(number, spawnLocation);
	
	this._type = type;
	
	this._manoeuvre = manoeuvre;
	
	this.sprite = g_sprites.ship2;
	
	this._scale = 1;
	

};

Enemy.prototype = new Entity();

// Initial, inheritable, default values
Enemy.prototype.rotation = 0;
Enemy.prototype.cx = 0;
Enemy.prototype.cy = 0;
Enemy.prototype.velX = -4;
Enemy.prototype.velY = 4;

Enemy.prototype.update = function (du) {
	
	spatialManager.unregister(this);
    if(this._isDeadNow){
        return entityManager.KILL_ME_NOW;
    }
	
	this.cx += this.velX * du;
	this.cy += this.velY * du;
	
	spatialManager.register(this);
};

Enemy.prototype.initialize = function (number, spawnLocation) {
	let offset = number * 64 + 10;
	
	switch (spawnLocation) {
		case 1:
			this.cx = 200;
			this.cy = -4 - offset;
			this.velX = 2;
			this.velY = 4;
			break;
		case 2:
			this.cx = 400;
			this.cy = -4 - offset;
			this.velX = -2;
			this.velY = 4;
			break;
		case 3:
			this.cx = -4 - offset;
			this.cy = 400;
			this.velX = 4;
			this.velY = -4
			break;
		case 4:
			this.cx = g_canvas.width + 4 + offset;
			this.cy = 400;
			this.velX = -4;
			this.velY = -4;
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
