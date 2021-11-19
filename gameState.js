/*

gameState.js

A module which handles the state of the game, as required for...
e.g. starting, playing or ending.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

const gameState = {
    states : ["start", "play","winEnd", "loseEnd"],
    currState : "start",

    _continueKey : ' '.charCodeAt(0),//enter key
    _texts : [
        "WELCOME PILOT",
        "PRESS SPACE TO PLAY",
        "YOU WON",
        "YOU DIED",
        "FINAL SCORE: ",
        "PRESS SPACE TO CONTINUE"
    ],

    // PUBLIC METHODS

    changeStateForEnd : function (result) {
        if (result === "lost") {
            this.currState = this.states[3];
        }
        else if (result === "won") {
            this.currState = this.states[2];
        }
    },

    update : function (du){
        if(this.currState === this.states[0] ||
            this.currState === this.states[2] ||
            this.currState === this.states[3]) {
            if (eatKey(this._continueKey)) {
                this.currState = this.states[1];
                levelManager.resetGame();
            }
        }
    },

    render : function (ctx) {
        ctx.save();

        ctx.font = 'bold 40px consolas';
        ctx.lineWidth = .5;
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = "black";

        if (this.currState === this.states[0]) {
            writeTxt(ctx, this._texts[0],2, 2);
            writeTxt(ctx, this._texts[1],2, 1);
        }
        else if (this.currState === this.states[2]) {
            writeTxt(ctx, this._texts[2],3, 3);
            writeTxt(ctx, this._texts[4] + userInterface.getScore(),3, 2);
            writeTxt(ctx, this._texts[5],3, 1);
        }
        else if (this.currState === this.states[3]) {
            writeTxt(ctx, this._texts[3],3, 3);
            writeTxt(ctx, this._texts[4] + userInterface.getScore(),3, 2);
            writeTxt(ctx, this._texts[5],3, 1);
        }

        ctx.restore();
    }
}

function writeTxt(ctx,txt, num, pos) {
    ctx.font = 'bold 40px consolas';

    ctx.fillStyle = '#FFFFFF';
    const w = ctx.measureText(txt).width + 5;
    ctx.fillText(txt, (g_canvas.width-w)/2, g_canvas.height/num-pos*45);

    ctx.strokeStyle = "black";
    ctx.strokeText(txt,(g_canvas.width-w)/2, g_canvas.height/num-pos*45);
}
