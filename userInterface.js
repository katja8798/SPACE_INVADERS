// ====================
// UI / PROGRESS LOGIC 
// ====================

const userInterface = {
	height: 30,
	player_health: 3,
	score: 0,

	// Decrement player life pool
	loseHealth: function () {
		if (!g_playerInvincibility) {
			this.player_health -= 1;
		}
	},

	gainHealth: function () {
		//Does not gain health if it's 5 or over
		if (this.player_health < 5) {
			this.player_health += 1;
		}
	},

	increaseScoreFromPowerUp: function () {
		this.score += 100;
	},

	// Reset all relevant UI data
	// TODO: Have this function call entityManager
	// 		 to initiate a reset of level?
	gameOver: function () {
		this.score = 0;
		this.player_health = 3;
	},

	// Increase score according to type of enemy killed
	// TODO: Have enemy/entityManager call this function
	//       when an enemy entity requests deletion
	increaseScore: function (eType) {
		this.score += 100 + eType * 20;
	},

	getScore: function () {
		return this.score.toString();
	},

	render: function (ctx) {

		this.renderHealth(ctx);

		this.renderScore(ctx);
	},

	// Draws a sprite for every point of health remaining
	renderHealth: function (ctx) {

		const hp = this.player_health,
			sprite = g_sprites.heart,
			spriteHalfWidth = sprite.width / 2,
			spriteHalfHeight = sprite.height / 2;

		util.fillBox(ctx, 0, g_canvas.height - spriteHalfHeight * 2,
			5 * sprite.width, g_canvas.height, 'rgb(0,0,26)')

		for (let i = 0; i < hp; i++) {
			let x = i * sprite.width + spriteHalfWidth;
			let y = g_canvas.height - spriteHalfHeight;
			sprite.drawCentredAt(ctx, x, y, 0);
		}
	},

	renderScore: function (ctx) {

		ctx.save();

		ctx.font = 'bold 20px Consolas';
		ctx.lineWidth = .5;
		ctx.fillStyle = '#FFFFFF';

		let scoreText = "Score: " + this.getScore();
		let textWidth = ctx.measureText(scoreText).width + 5;

		ctx.fillText(scoreText, g_canvas.width - textWidth, 20);
		ctx.restore();
	}
};

