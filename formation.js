// =========
// FORMATION
// =========

var formation = {

_formationArray : [],

_width : 500,

_height : 250,

// Enemy sprites are 48x48, leave space between!
_cellWidth : 50,
_cellHeight : 50,

// Avoid having to use division
_cellHalfWidth : 25,
_cellHalfHeight : 25,

// Top-left coordinates of formation rectangle
_x0 : 50,
_y0 : 100,

// Formation movement (Find a good value)
_velX : .8,


// PRIVATE METHODS




// PUBLIC METHODS

// Enemy calls to reserve a cell in the array.
// Returns cellID which enemy uses to get coordinates
getEmptyCell : function (type) {
	
	if (type === 1) {
		for (var i = 3; i < 5; i++) {
			for (var j = 0; j < 10; j++) {
			
				if (this._formationArray[i][j] === 0) {
					let cellID = {
						row : i,
						col : j
					}
					this._formationArray[i][j] = 1;
					return cellID;
				}
			}
		}
		// Return special value if there are no
		// empty cells for this enemy type.
		return 0;
	}

	else if (type === 2) {
		for (var i = 1; i < 3; i++) {
			for (var j = 0; j < 10; j++) {
			
				if (this._formationArray[i][j] === 0) {
					let cellID = {
						row : i,
						col : j
					}
					this._formationArray[i][j] = 1;
					return cellID;
				}
			}
		}
		// Return special value if there are no
		// empty cells for this enemy type.
		return 0;
	}
},

getCellCoordinates : function (id) {
	let row = id.row;
	let col = id.col;

	let coords = {
		cx : this._x0 + this._cellWidth * col + this._cellHalfWidth,
		cy : this._y0 + this._cellHeight * row + this._cellHalfHeight
	}

	return coords;
},

returnCell : function (id) {
	let row = id.row;
	let col = id.col;

	this._formationArray[row][col] = 0;
},

update : function (du) {

	let oldX = this._x0;
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
render : function (ctx) {

	if (g_doFormation) {

		for (var i = 0; i < 5; i++) {
			let s = "["
			for (var j = 0; j < 10; j++) {
				s += this._formationArray[i][j].toString() + " ";
				let cellX = this._x0 + j * this._cellWidth;
				let cellY = this._y0 + i * this._cellHeight;
				util.strokeBox(ctx, cellX, cellY, 
					this._cellWidth, this._cellHeight, 'red');
			}
			s += "]";
			let offset = 15*i;
			util.renderText(ctx, s, 10, 30+offset, .5, 'red', 'red');
		}
	}
},


// Initialize formation with 5 rows of 10 elements
// Mark each element with special value 0: meaning 'unoccupied'
init : function () {
	
	for (var i = 0; i < 5; i++) {
		this._formationArray.push([]);
		for (var j = 0; j < 10; j++) {
			this._formationArray[i].push(0);
		}
	}
}
}