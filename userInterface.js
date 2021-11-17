// ====================
// UI / PROGRESS LOGIC 
// ====================

var userInterface = {
	height : 30,
	player_health : 3,
	score : 0,
	
	// Decrement player life pool and start over
	// if it reaches zero
	loseHealth : function () {
		
		this.player_health -= 1;

		//TODO change gameState to state = end
		if (this.player_health === 0) {
			gameState.currState = gameState.states[2];
		}
	},

	gainHealth : function () {
		//Does not gain health if it's 5 or over
		if(this.player_health < 5) {
			this.player_health += 1;
		}
		//restrict health? have max health be 5?
	},

	increaseScoreFromPowerUp : function () {
		this.score += 100;
	},
	
	// Reset all relevant UI data
	// TODO: Have this function call entityManager
	// 		 to initiate a reset of level?
	gameOver : function () {
		
		this.score = 0;
		this.player_health = 3;
		
	},
	
	// Increase score according to type of enemy killed
	// TODO: Have enemy/entityManager call this function
	//       when an enemy entity requests deletion
	increaseScore : function (eType) {
		//Placeholder-þarf að bæta við mismunandi cases fyrir eType
		this.score += 100;
		
	},
	
	render : function (ctx) {

		this.renderHealth(ctx);
		
		this.renderScore(ctx);
	},
	
	// Draws a sprite for every point of health remaining
	renderHealth : function (ctx) {

		const hp = this.player_health,
			sprite = g_sprites.heart,
			spriteHalfWidth = sprite.width / 2,
			spriteHalfHeight = sprite.height / 2;

		for (let i = 0; i < hp; i++) {
			let x = i * sprite.width + spriteHalfWidth;
			let y = g_canvas.height - spriteHalfHeight;
			sprite.drawCentredAt(ctx, x, y, 0);
		}
	},
	
	renderScore : function (ctx) {

		ctx.save();

		ctx.font = '20px bold Helvetica';
		ctx.lineWidth = .5;
		ctx.fillStyle = '#FFFFFF';
		
		let scoreText = "Score " + this.score.toString();
		let textWidth = ctx.measureText(scoreText).width + 5;
		
		ctx.fillText(scoreText, g_canvas.width - textWidth, 20);
		ctx.restore();
	}
}

