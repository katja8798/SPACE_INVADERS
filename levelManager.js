// ==========
// LEVEL STUFF
// ==========

var levelManager = {
	
_currentLevel : {},

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


// Levels
_levelOne : {
	
	// Determines at what time (in seconds!) waves spawn
	_enemiesSpawnAtT : [3, 8, 12, 18],
	
	// Determines how many squads spawn for each wave
	_numSquadsAtT : [2, 2, 2, 2],
	
	// Elements define a "squad" of enemy entities 
	_enemies : [
		[4,1,1,1],
		[4,2,1,2],
		[4,3,1,1],
		[4,4,1,1],
		[4,1,1,1],
		[4,2,1,2],
		[4,3,1,1],
		[4,4,1,1]
	],
	
	_nextLevel : this._levelTwo
},

_levelTwo : {},


// PRIVATE METHODS

//
_generateWave: function() {
	let level = this._currentLevel;
	let wave = this._nextWaveNumber;
	let squad = this._nextSquadNumber;
	let numSquads = level._numSquadsAtT[wave];
	
	for (var i = squad; i < numSquads + squad; i++) {
		this._enemyWave.push(level._enemies[i]);
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
	
	for (var i = 0; i < length; i++) {
		let squad = this._enemyWave[i];
		n = squad[0];
		l = squad[1];
		t = squad[2];
		m = squad[3];
		entityManager.generateEnemies(n,l,t,m);
		
		this._enemiesAlive += n;
	}
	
	this._enemyWave = [];
},

_levelFinished: function() {
	this._waitForLastKill = false;
	this._currentLevel = this._currentLevel._nextLevel;
	this._nextWaveT = this._currentLevel._enemiesSpawnAtT[0] * 1000;
},


// PUBLIC METHODS

// Important: update function uses real time passed for accurate timing
// 			  See changes in update.js
update: function(dt) {
	this._dt += dt;
	
	if (this._dt >= this._nextWaveT && !this._waitForLastKill) {
		this._generateWave();
	}
},

init: function() {
	this._currentLevel = this._levelOne;
	this._nextWaveT = this._currentLevel._enemiesSpawnAtT[0] * 1000;
}	
	
}
