// ======================
// ENEMY PATHS/MANOEUVRES
// ======================

var paths = {

// _paths array contains all paths.
// Element _paths[i] is a path
// Element _paths[i][j] is a bezierCurve or circle manoeuvre
// Element _paths[j][j][k] is a point = {x,y}
// TODO: May have to go deeper??: 
//		 allPaths[ spawnPoints[ paths[ curves/manoeuvres[] ] ] ]
_paths : [],

// TODO: Make a combination of key presses change which path to draw
//		 for debug purposes. Change the render function accordingly.
_drawPath : 0,

// PRIVATE METHODS

// Calculate and return a point on a cubic Bezier curve
// for any given t, where 0 <= t <= 1.
_bezierPoint : function (t, p0, p1, p2, p3) {
	// Intermediate points
	let c1 = {	x : 3*(p1.x - p0.x),
				y : 3*(p1.y - p0.y)};
				
	let c2 = { 	x : 3*(p2.x - p1.x) - c1.x,
				y : 3*(p2.y - p1.y) - c1.y };
				
	let c3 = {	x : p3.x - p0.x - c1.x - c2.x,
				y : p3.y - p0.y - c1.y - c2.y};
				
	// Calculate point on the curve
	let tt = util.square(t)
	
	let p = {
		x : Math.round((tt * t * c3.x) + (tt * c2.x) + (t * c1.x) + p0.x),
		y : Math.round((tt * t * c3.y) + (tt * c2.y) + (t * c1.y) + p0.y)
	}
	
	return p;
},

// Generates a cubic Bezier curve
// n = number of points generated on the curve
// p0 = starting point of curve {x0,y0}
// p1, p2 = control points, (usually) not on curve
// p3 = end point of curve {xn,yn}
_bezierCurve : function (n, p0, p1, p2, p3) {
	let a_bezier = [];
	let dt = 1 / n;
	let t = 0;
	
	for (var i = 0; i < n; i++) {
		t += dt;
		let p = this._bezierPoint(t, p0, p1, p2, p3);
		a_bezier.push(p);
	}
	return a_bezier;
},

_circleManoeuvre : function (n, r) {},

// PUBLIC METHODS

// Iterates through every path for every spawn point
// and draws every point generated.
render : function (ctx) {
	if (g_doPaths) {
		let pathsL = this._paths.length;
		for (var i=0; i < pathsL; i++) {
			let pathL = this._paths[i].length;
			for (var j=0; j < pathL; j++) {
				let curveL = this._paths[i][j].length;
				for (var k=0; k < curveL; k++) {
					let p = this._paths[i][j][k];
					util.fillCircle(ctx, p.x, p.y, 1, 'red');
				}
			}
		}
	}
},

getPathPoint : function (spawnPoint, path, pointN) {
	let l = this._paths[spawnPoint];
	
	if (this._paths.length > spawnPoint && 
		typeof this._paths[spawnPoint][path] !== 'undefined' && 
		this._paths[spawnPoint][path].length > 0) {
			
		return this._paths[spawnPoint][path][pointN];
	}
	// Return special value if path is finished
	else {
		return 0
	}	
},



init : function() {
	
// Spawn point 1
	
	// Path 1
	let s1p1 = [];
	s1p1.push(this._bezierCurve(200,{x:200,y:0},{x:0,y:400},{x:400,y:0},{x:200,y:300}));
	s1p1.push(this._bezierCurve(200,{x:200,y:300},{x:0,y:600},{x:600,y:500},{x:300,y:200}));
	this._paths.push(s1p1);
	
// Spawn point 2

	// Path 1
	let path2 = [];
	path2.push(this._bezierCurve(200,{x:400,y:0},{x:600,y:400},{x:200,y:0},{x:400,y:300}));
	path2.push(this._bezierCurve(200,{x:400,y:300},{x:600,y:600},{x:0,y:500},{x:300,y:200}));
	this._paths.push(path2);
	
}

}