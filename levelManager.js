// ==========
// LEVEL STUFF
// ==========

const levelManager = {
	
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

_totalEnemies : 0,

// Enemy bullet stuff
_shotsPerPeriod : 1,

_shotsFired : 0,

_bulletT : 0,


// PRIVATE METHODS

	_generateWave: function () {
		let level = this._currentLevel;
		let wave = this._nextWaveNumber;
		let squad = this._nextSquadNumber;
		let numSquads = level._numSquadsAtT[wave];

		for (let i = squad; i < numSquads + squad; i++) {
			this._enemyWave.push(level._enemySquad[i]);
		}

		let nextWave = wave + 1;
		if (nextWave >= level._enemiesSpawnAtT.length) {
			this._waitForLastKill = true;
		} else {
			this._nextWaveT = level._enemiesSpawnAtT[nextWave] * 1000;
			this._nextWaveNumber = nextWave;
			this._nextSquadNumber += numSquads;
		}

		this._spawnEnemies();
	},

	_spawnEnemies: function () {
		let length = this._enemyWave.length;

		for (let i = 0; i < length; i++) {
			let squad = this._enemyWave[i],
				n = squad[0],
				l = squad[1],
				t = squad[2],
				m = squad[3],
				f = squad[4];

			for (let j = 0; j < n; j++) {
				entityManager.generateEnemies({
						_numberInLine: j,
						_spawnPoint: l - 1,
						_type: t,
						_manoeuvre: m - 1,
						_formation: f
					}
				);
			}
		}

		this._enemyWave = [];
	},

	_levelFinished: function () {
		if (this._nextLevel < this._levels.length) {
			this._resetCurrentLevel();
			this._loadLevel(this._nextLevel);
		} else {
			gameState.currState = gameState.states[2];
		}
	},

	_resetCurrentLevel: function () {
		this._currentLevel._enemiesSpawnAtT = [];
		this._currentLevel._numSquadsAtT = [];
		this._currentLevel._enemySquad = [];
		this._nextWaveT = 0;
		this._nextWaveNumber = 0;
		this._nextSquadNumber = 0;
		this._waitForLastKill = false;
		this._dt = 0;
		this._totalEnemies = 0;
		//makes screen be empty
		entityManager.powerUpOff();
	},

	_loadLevel: function (levelNumber) {
		let requestedLevel = this._levels[levelNumber];

		this._copyProperties(requestedLevel._enemiesSpawnAtT,
			this._currentLevel._enemiesSpawnAtT);
		this._copyProperties(requestedLevel._numSquadsAtT,
			this._currentLevel._numSquadsAtT);
		this._copyProperties(requestedLevel._enemySquad,
			this._currentLevel._enemySquad);

		let squads = this._currentLevel._enemySquad;
		for (let i = 0; i < squads.length; i++) {
			this._totalEnemies += squads[i][0];
		}

		this._shotsPerPeriod = levelNumber + 1;
		this._nextWaveT = this._currentLevel._enemiesSpawnAtT[0] * 1000;
		this._nextLevel++;
	},

	_copyProperties: function (copyFrom, copyTo) {
		for (let i = 0; i < copyFrom.length; i++) {
			if (copyFrom[i].length > 1) {
				copyTo.push([]);
				for (let j = 0; j < copyFrom[i].length; j++) {
					copyTo[i].push(copyFrom[i][j]);
				}
			} else {
				copyTo.push(copyFrom[i]);
			}
		}
	},


// PUBLIC METHODS

	enemyKilled: function () {
		this._totalEnemies--;
	},

	skipLevel: function () {
		this._levelFinished();
	},

// Important: update function uses real time passed for accurate timing
// 			  See changes in update.js
	update: function (dt) {
		this._dt += dt;
		this._bulletT += dt;

		if (this._bulletT > 5000) {
			this._bulletT = 0;
			this._shotsFired = 0;
		}

		if (this._dt >= this._nextWaveT && !this._waitForLastKill) {
			this._generateWave();
		}

		if (this._waitForLastKill && this._totalEnemies === 0) {
			this._levelFinished();
		}
	},

	render: function (ctx) {

		let s = "Enemies left: " + this._totalEnemies.toString();
		util.renderText(ctx, s, 10, 10, .5, 'white', 'white');

		if (this._dt < 3000) {
			let tSize = Math.floor(300 - this._dt / 10);
			let font = tSize.toString() + "px";

			ctx.save();
			ctx.font = font + " bold Consolas";
			ctx.lineWidth = 1;
			ctx.strokeStyle = 'white';
			ctx.fillStyle = 'white';

			let text = 'Level ' + (this._nextLevel).toString();
			let textWidth = ctx.measureText(text).width;

			let x = g_canvas.width / 2 - textWidth / 2;
			let y = g_canvas.height / 2;
			ctx.strokeText(text, x, y);
			ctx.fillText(text, x, y);
			ctx.restore();
		}
	},

	init: function () {
		this._loadLevel(this._nextLevel);
	},

	shotFired: function () {
		this._shotsFired++;
	},

	canFireBullet: function () {
		return this._shotsFired < this._shotsPerPeriod;
	},


	resetGame: function () {
		userInterface.gameOver();
		entityManager.killAllEnemies();
		this._resetCurrentLevel();
		this._nextLevel = 0;
		this.init();
	},


// LEVELS

	_levels: [

	// enemySquad:
	// [N, L, T, M, F] where:
	// N = Number of enemies
	// L = Spawning Location
	// T = Type of enemy
	// M = Manoeuvre (which path of L they take)
	// F = Formation (does this squad go to formation?)
	
	// LEVEL 1
	{
		_enemiesSpawnAtT: [3, 8, 14, 18, 24, 28],
		_numSquadsAtT: [2,2,2,1,2,1],
		_enemySquad: [
			[4,1,1,1,true],
			[4,2,1,1,true],
			[4,1,1,2,false],
			[4,2,1,2,false],
			[4,5,2,1,true],
			[4,6,2,1,true],
			[4,3,1,2,false],
			[4,1,1,1,true],
			[4,2,1,1,true],
			[4,4,1,2,false]
		]
	},
	
	// LEVEL 2
	{
		_enemiesSpawnAtT: [3, 5, 12, 18, 22, 25],
		_numSquadsAtT: [1,1,2,2,2,2],
		_enemySquad: [
			[5,3,2,2,false],
			[5,6,2,2,false],
			[5,1,1,1,true],
			[5,2,1,1,true],
			[3,3,1,1,true],
			[3,4,1,1,true],
			[4,1,1,2,false],
			[4,2,1,2,false],
			[3,3,1,1,true],
			[4,4,1,1,true]
		]
	},
	
	// LEVEL 3
	{
		_enemiesSpawnAtT: [3, 5, 8, 12, 18],
		_numSquadsAtT: [2,1,2,2,2],
		_enemySquad: [
			[4,1,1,1,true],
			[4,2,1,1,true],
			[3,3,3,1,true],
			[4,3,1,1,true],
			[4,4,1,1,true],
			[4,1,1,1,true],
			[4,2,1,1,true],
			[4,3,1,1,true],
			[4,4,1,1,true]
		]
	},
	
	// LEVEL 4
	{
		_enemiesSpawnAtT: [3, 8, 12, 18],
		_numSquadsAtT: [2,2,2,2],
		_enemySquad: [
			[4,1,1,1,true],
			[4,2,1,1,true],
			[4,3,1,1,true],
			[4,4,1,1,true],
			[4,1,1,1,true],
			[4,2,1,1,true],
			[4,3,1,1,true],
			[4,4,1,1,true]
		]
	},
]	
}
