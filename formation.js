// =========
// FORMATION
// =========

const formation = {

	_formationArray: [],

	_width: 500,

	_height: 250,

// Enemy sprites are 48x48, leave space between!
	_cellWidth: 50,
	_cellHeight: 50,

// Avoid having to use division
	_cellHalfWidth: 25,
	_cellHalfHeight: 25,

// Top-left coordinates of formation rectangle
	_x0: 50,
	_y0: 100,

// Formation movement (Find a good value)
	_velX: .8,
	_velY: 0,


// PRIVATE METHODS


// PUBLIC METHODS

// Enemy calls to reserve a cell in the array.
// Returns cellID which enemy uses to get coordinates
	getEmptyCell: function (type) {
		let r,
			c;

		if (type === 1) {
			r = 3;
			c = 5;
		} else if (type === 2) {
			r = 1;
			c = 3;
		} else {
			r = 0;
			c = 1;
		}

		let cellID = {
			row: 0,
			col: 0
		}

		for (let i = r; i < c; i++) {
			for (let j = 4; j >= 0; j--) {
				if (this._formationArray[i][j] === 0) {
					cellID.row = i;
					cellID.col = j;
					this._formationArray[i][j] = 1;
					return cellID;
				} else if (this._formationArray[i][9 - j] === 0) {
					cellID.row = i;
					cellID.col = 9 - j;
					this._formationArray[i][9 - j] = 1;
					return cellID;
				}
			}
		}
		// Return special value if there are no
		// empty cells for this enemy type.
		return 0;
	},

	getCellCoordinates: function (id) {
		let row = id.row;
		let col = id.col;

		return {
			cx: this._x0 + this._cellWidth * col + this._cellHalfWidth,
			cy: this._y0 + this._cellHeight * row + this._cellHalfHeight
		};
	},

	returnCell: function (id) {
		let row = id.row;
		let col = id.col;

		this._formationArray[row][col] = 0;
	},

// TODO
// TODO
// TODO		Láta levelManager kalla á þetta eftir dt > ákveðinn tíma
// TODO
	chargePlayer: function () {

	},

	update: function (du) {

	let nextX = this._x0 + this._velX * du;

	if (nextX < 0 || nextX + this._width > g_canvas.width) {
		this._velX *= -1;
		this._x0 = this._x0 + this._velX * du;
	}
	else {
		this._x0 = nextX;
	}
},

// Turn on rendering for formation with Key 'J'
	render: function (ctx) {

		if (g_doFormation) {

			for (let i = 0; i < 5; i++) {
				let s = "["
				for (let j = 0; j < 10; j++) {
					s += this._formationArray[i][j].toString() + " ";
					let cellX = this._x0 + j * this._cellWidth;
					let cellY = this._y0 + i * this._cellHeight;
					util.strokeBox(ctx, cellX, cellY,
						this._cellWidth, this._cellHeight, 'red');
				}
				s += "]";
				let offset = 15 * i;
				util.renderText(ctx, s, 20, 10, 30 + offset, .5, 'red');
			}
		}
	},


// Initialize formation with 5 rows of 10 elements
// Mark each element with special value 0: meaning 'unoccupied'
	init: function () {
		for (let i = 0; i < 5; i++) {
			this._formationArray.push([]);
			for (let j = 0; j < 10; j++) {
				this._formationArray[i].push(0);
			}
		}
	}
};