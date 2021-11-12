
var formation = {

_formationArray : [],

// Horizontal & vertical space between enemies in formation
_elementOffset : 5,

_formationWidth : 400,

_formationHeight : 200,

// THIS SHOULD MATCH SPRITE DIMENSIONS IF USING OFFSET
_elementWidth : 34,
_elementHeight : 34,

// Formation movement (Find a good value)
_velX : 5,











// PRIVATE METHODS








// PUBLIC METHODS

getEmptyCell : function (type) {
	
},




// Initialize formation with 5 rows of 10 elements
// Mark each element with special value 0: meaning 'unoccupied'
init : function () {
	
	for (var i = 0; i < 5; i++) {
		let row = [];
		for (var j = 0; j < 10; j++) {
			row.push(0);
		}
		this._formationArray.push(row);
	}
}
}