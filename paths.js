// ======================
// ENEMY PATHS/MANOEUVRES
// ======================

var paths = {

_pointsPerCurve : 200,

// _paths array contains all paths.
// Element _paths[i] is a path
// Element _paths[i][j] is a bezierCurve or circle manoeuvre
// Element _paths[j][j][k] is a point = {x,y}
// TODO: May have to go deeper??: 
//		 allPaths[ spawnPoints[ paths[ curves/manoeuvres[] ] ] ]
_paths : [],

// TODO: Make a combination of key presses change which path to draw
//		 for debug/visualization purposes. 
//		 Change the render function accordingly.
_drawPath : 0,

// PRIVATE METHODS

// Generates a cubic Bezier curve
// n = number of points generated on the curve
// p0 = starting point of curve {x0,y0}
// p1, p2 = control points, (usually) not on curve
// p3 = end point of curve {xn,yn}
_bezierCurve : function (n, p0, p1, p2, p3) {
	
	let curve = [];
	let t = 0;
	let dt = 1/n;
	
	// Intermediate points
	let c1 = {	x : 3*(p1.x - p0.x),
				y : 3*(p1.y - p0.y)};
				
	let c2 = { 	x : 3*(p2.x - p1.x) - c1.x,
				y : 3*(p2.y - p1.y) - c1.y };
				
	let c3 = {	x : p3.x - p0.x - c1.x - c2.x,
				y : p3.y - p0.y - c1.y - c2.y};
	

	for (var i = 0; i < n; i++) {
		t += dt;
		
		// Calculate point on the curve
		let tt = util.square(t)
		
		let p = {
			x : Math.round((tt * t * c3.x) + (tt * c2.x) + (t * c1.x) + p0.x),
			y : Math.round((tt * t * c3.y) + (tt * c2.y) + (t * c1.y) + p0.y)
		}
		
		curve.push(p);
	}
	
	return curve;
},

_circleManoeuvre : function (n, r) {},

// PUBLIC METHODS

// Iterates through every path for every spawn point
// and draws every point generated.
render : function (ctx) {
	if (g_doPaths) {
		for (var i=0; i < this._paths.length; i++) {
			for (var j=0; j < this._paths[i].length; j++) {
				for (var k=0; k < this._paths[i][j].length; k++) {
					for (var l=0; l < this._paths[i][j][k].length; l++) {
						let p = this._paths[i][j][k][l];
						util.fillCircle(ctx, p.x, p.y, 1, 'red');
					}
				}
			}
		}
	}
},

getPathPoint : function (spawnPoint, path, curveN, pointN) {
	let p = this._paths[spawnPoint][path];
	
	if (p !== 'undefined' &&
		p.length > curveN && 
		typeof p[curveN] !== 'undefined' && 
		p[curveN].length > 0) {
			
		return this._paths[spawnPoint][path][curveN][pointN];
	}
	// Return special value if path is finished
	else {
		return 0
	}	
},

getPointsPerCurve : function () {
	let maxPoints = this._pointsPerCurve;
	return maxPoints;
},



init : function() {

// this._paths = [ 
//	SP1[ Path1[] Path2[].. PathN[]]   
//  SP2[ Path1[] Path2[] ..PathN[]]
//   .
//   .
//   ]

let nPoints = this._pointsPerCurve;
	
// Spawn point 1
	let sp1 = [];
	this._paths.push(sp1);

	// Path 1
	let s1p1 = [];
	s1p1.push(this._bezierCurve(nPoints,{x:200,y:0},{x:0,y:400},{x:400,y:0},{x:200,y:300}));
	s1p1.push(this._bezierCurve(nPoints,{x:200,y:300},{x:0,y:600},{x:600,y:500},{x:300,y:200}));
	sp1.push(s1p1);

	// Path 2
	
// Spawn point 2
	let sp2 = [];
	this._paths.push(sp2);

	// Path 1
	let s2p1 = [];
	s2p1.push(this._bezierCurve(nPoints,{x:400,y:0},{x:600,y:400},{x:200,y:0},{x:400,y:300}));
	s2p1.push(this._bezierCurve(nPoints,{x:400,y:300},{x:600,y:600},{x:0,y:500},{x:300,y:200}));
	sp2.push(s2p1);
	
	// Path 2


// Spawn point 3
	let sp3 = [];
	this._paths.push(sp3);
	
	// Path 1
	s3p1 = [];
	s3p1.push(this._bezierCurve(nPoints,{x:0,y:400},{x:200,y:450},{x:400,y:250},{x:150,y:150}));
	s3p1.push(this._bezierCurve(nPoints,{x:150,y:150},{x:-100,y:20},{x:-100,y:500},{x:300,y:200}));

	sp3.push(s3p1);


// Spawn point 4
	let sp4 = [];
	this._paths.push(sp4);	

	// Path 1
	s4p1 = [];
	s4p1.push(this._bezierCurve(nPoints,{x:600,y:400},{x:400,y:450},{x:200,y:250},{x:450,y:150}));
	s4p1.push(this._bezierCurve(nPoints,{x:450,y:150},{x:700,y:20},{x:700,y:500},{x:300,y:200}));

	sp4.push(s4p1);
}

}