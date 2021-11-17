// ==========
// LEVEL STUFF
// ==========

var levelManager = {
	
_nextLevel : 0,
	
_currentLevel : {
	_enemiesSpawnAtT : [],
	_numSquadsAtT : [],
	_enemySquad : []
},

// Elements in _enemyWave are the "squads" and are defined by:
// [N, L, T, M] where:
// N = Number of enemies
// L = Spawning Location
// T = Type of enemy
// M = Manoeuvre (how they move from spawn to formation)
_enemyWave : [],

// Time passed since level start (milliseconds)
_dt : 0,

// Time at which next wave of enemies spawns
_nextWaveT : 0,

_nextWaveNumber : 0,

_nextSquadNumber : 0,

// Next level starts when all enemies are dead
_waitForLastKill : false,

_enemiesAlive : 0,

// Enemy bullet stuff
_shotsPerPeriod : 2,

_shotsFired : 0,

_bulletT : 0,


// PRIVATE METHODS

_generateWave: function() {
	let level = this._currentLevel;
	let wave = this._nextWaveNumber;
	let squad = this._nextSquadNumber;
	let numSquads = level._numSquadsAtT[wave];
	
	for (var i = squad; i < numSquads + squad; i++) {
		this._enemyWave.push(level._enemySquad[i]);
	}
	
	let nextWave = wave + 1;
	if (nextWave >= level._enemiesSpawnAtT.length) {
		this._waitForLastKill = true;
	}
	else {
		this._nextWaveT = level._enemiesSpawnAtT[nextWave] * 1000;
		this._nextWaveNumber = nextWave;
		this._nextSquadNumber += numSquads;
	}
	
	this._spawnEnemies();
},

_spawnEnemies: function() {
	let length = this._enemyWave.length;
	
	for (let i = 0; i < length; i++) {
		let squad = this._enemyWave[i],
		n = squad[0],
		l = squad[1],
		t = squad[2],
		m = squad[3];
		
		for (let j = 0; j < n; j++) {
			entityManager.generateEnemies({
				_numberInLine : j,
				_spawnPoint : l - 1,
				_type : t ,
				_manoeuvre : m - 1,
				}
			);
		}

		this._enemiesAlive += n;
	}
	
	this._enemyWave = [];
},

_levelFinished: function() {
	this._waitForLastKill = false;
	this._resetCurrentLevel();
	this._loadLevel(this._nextLevel);
},

_loadLevel: function(levelNumber) {
	let requestedLevel = this._levels[levelNumber];
	
	this._copyProperties(requestedLevel._enemiesSpawnAtT, 
					 this._currentLevel._enemiesSpawnAtT);
	this._copyProperties(requestedLevel._numSquadsAtT, 
					 this._currentLevel._numSquadsAtT);
	this._copyProperties(requestedLevel._enemySquad, 
					 this._currentLevel._enemySquad);
	
	this._nextWaveT = this._currentLevel._enemiesSpawnAtT[0] * 1000;
	this._nextLevel++;
},

_copyProperties: function(copyFrom, copyTo) {
	for (var i=0; i < copyFrom.length; i++) {
		if (copyFrom[i].length > 1) {
			copyTo.push([]);
			for (var j=0; j < copyFrom[i].length; j++) {
				copyTo[i].push(copyFrom[i][j]);
			}
		}	
		else {
			copyTo.push(copyFrom[i]);
		}
	}
},

_resetCurrentLevel: function() {
	this._currentLevel._enemiesSpawnAtT = [];
	this._currentLevel._numSquadsAtT = [];
	this._currentLevel._enemySquad = [];
},


// PUBLIC METHODS

// Important: update function uses real time passed for accurate timing
// 			  See changes in update.js
update: function(dt) {
	this._dt += dt;
	this._bulletT += dt;

	if (this._bulletT > 5000) {
		this._bulletT = 0;
		this._shotsFired = 0;
	}
	
	if (this._dt >= this._nextWaveT && !this._waitForLastKill) {
		this._generateWave();
	}
},

init: function() {
	this._loadLevel(this._nextLevel);
},

shotFired: function() {
	this._shotsFired++;
},

canFireBullet: function() {
	if (this._shotsFired < this._shotsPerPeriod) {
		return true;
	}
	else {
		return false;
	}
},



// LEVELS

_levels : [

	// enemySquad:
	// [N, L, T, M] where:
	// N = Number of enemies
	// L = Spawning Location
	// T = Type of enemy
	// M = Manoeuvre (which path of L they take)
	
	// LEVEL 1
	{
		_enemiesSpawnAtT: [3, 8, 12, 18],
		_numSquadsAtT: [2,2,2,2],
		_enemySquad: [
			[4,1,1,1],
			[4,2,1,1],
			[4,3,1,1],
			[4,4,1,1],
			[4,1,1,1],
			[4,2,1,1],
			[4,3,1,1],
			[4,4,1,1]
		]
	},
	
	// LEVEL 2
	{
		_enemiesSpawnAtT: [3, 8, 12, 18],
		_numSquadsAtT: [2,2,2,2],
		_enemySquad: [
			[2,1,1,1],
			[2,2,1,1],
			[2,3,1,1],
			[2,4,1,1],
			[1,1,1,1],
			[1,2,1,1],
			[3,3,1,1],
			[3,4,1,1]
		]
	},
	
	// LEVEL 3
	{
		_enemiesSpawnAtT: [3, 8, 12, 18],
		_numSquadsAtT: [2,2,2,2],
		_enemySquad: [
			[4,1,1,1],
			[4,2,1,2],
			[4,3,1,1],
			[4,4,1,1],
			[4,1,1,1],
			[4,2,1,2],
			[4,3,1,1],
			[4,4,1,1]
		]
	},
	
	// LEVEL 4
	{
		_enemiesSpawnAtT: [3, 8, 12, 18],
		_numSquadsAtT: [2,2,2,2],
		_enemySquad: [
			[4,1,1,1],
			[4,2,1,2],
			[4,3,1,1],
			[4,4,1,1],
			[4,1,1,1],
			[4,2,1,2],
			[4,3,1,1],
			[4,4,1,1]
		]
	},
]	
}
