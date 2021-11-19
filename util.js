// util.js
//
// A module of utility functions, with no private elements to hide.
// An easy case; just return an object containing the public stuff.

"use strict";


const util = {


// RANGES
// ======

    clampRange: function (value, lowBound, highBound) {
        if (value < lowBound) {
            value = lowBound;
        } else if (value > highBound) {
            value = highBound;
        }
        return value;
    },

    wrapRange: function (value, lowBound, highBound) {
        while (value < lowBound) {
            value += (highBound - lowBound);
        }
        while (value > highBound) {
            value -= (highBound - lowBound);
        }
        return value;
    },

    isBetween: function (value, lowBound, highBound) {
        if (value < lowBound) {
            return false;
        }
        return value <= highBound;

    },


// RANDOMNESS
// ==========

    randRange: function (min, max) {
        return (min + Math.random() * (max - min));
    },

    getRandomInt: function (min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); 
      },

// MISC
// ====

    square: function (x) {
        return x * x;
    },


// DISTANCES
// =========

    distSq: function (x1, y1, x2, y2) {
        return this.square(x2 - x1) + this.square(y2 - y1);
    },

    wrappedDistSq: function (x1, y1, x2, y2, xWrap, yWrap) {
        let dx = Math.abs(x2 - x1),
            dy = Math.abs(y2 - y1);
        if (dx > xWrap / 2) {
            dx = xWrap - dx;
        }

        if (dy > yWrap / 2) {
            dy = yWrap - dy;
        }
        return this.square(dx) + this.square(dy);
    },


// CANVAS OPS
// ==========

clearCanvas: function (ctx) {
    const prevfillStyle = ctx.fillStyle;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = prevfillStyle;
},

strokeCircle: function (ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
},

fillCircle: function (ctx, x, y, r, style) {
    const prevFillStyle = ctx.fillStyle;
    ctx.fillStyle = style;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = prevFillStyle;
},

fillBox: function (ctx, x, y, w, h, style) {
    const oldStyle = ctx.fillStyle;
    ctx.fillStyle = style;
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = oldStyle;
},
    
strokeBox : function (ctx, x, y, w, h, style) {
	var oldStyle = ctx.strokeStyle;
	ctx.strokeStyle = style;
	ctx.strokeRect(x, y, w, h);
	ctx.strokeStyle = oldStyle;
},

renderText : function (ctx, str, x, y, lineWidth, fillStyle, strokeStyle) {
	ctx.save();
	ctx.font = "12px bold Verdana";
	ctx.lineWidth = lineWidth;
	ctx.strokeStyle = strokeStyle;
	ctx.fillStyle = fillStyle;
	
	let s = str;
	let textWidth = ctx.measureText(str).width;
	ctx.fillText(str, x, y);
	ctx.strokeText(str, x, y);
	ctx.restore();
},

out: function (/* args */) {
    const args = arguments;
    console.log.apply(console, args);

    const strs = [];
    for (let i = 0; i < args.length; ++i) {
        let thing = args[i];
        if (typeof (thing) === "object") {
            thing = JSON.stringify(thing);
        }
        strs.push(thing);
        }
        const line = strs.join(" ") + "<br/>";

        document.getElementById("output").innerHTML += line;
    }
};
