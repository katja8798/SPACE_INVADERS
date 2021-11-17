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
    _states : ["start", "play","end"],
    _continueKey : ' '.charCodeAt(0),//enter key
    _currState : "start",
    _texts : [
        "WELCOME PILOT",
        "PRESS ENTER TO PLAY",
        "YOU WON",
        "YOU LOSE",
        "PRESS ENTER TO PLAY AGAIN"],
    _currText : ["WELCOME PILOT","PRESS ENTER TO PLAY"],

    // PUBLIC METHODS
    update : function (du){
        //check if already playing
        if(this._currState !== this._states[1]) {
            if (eatKey(this._continueKey)) {
                //start to play
                if (this._currState === this._states[0]) {
                    this._currState = this._states[1];
                }
                //end to play
                if (this._currState === this._states[2]) {
                    this._currState = this._states[1];
                }
            }
        }
        else {
            //TODO when game ends, either by winning or losing reset everything
            //levels, score, life and set text accordingly in gameState
        }
    },

    render : function (ctx) {
        ctx.save();


        let gapX = 50,
            gapY = 190;

        util.fillBox(ctx, gapX, gapY,
            g_canvas.width-gapX*2, g_canvas.height-gapY*2, 'rgb(0,0,26)');

        ctx.font = 'bold 40px consolas';
        ctx.lineWidth = .5;
        ctx.fillStyle = '#FFFFFF';

        let stateTxtAbove = this._currText[0],
            txtWAbove = ctx.measureText(stateTxtAbove).width + 5;

        ctx.fillText(stateTxtAbove, (g_canvas.width-txtWAbove)/2, g_canvas.height/2-20);

        let stateTxtBelow = this._currText[1],
            txtWBelow = ctx.measureText(stateTxtBelow).width + 5;
        ctx.fillText(stateTxtBelow, (g_canvas.width-txtWBelow)/2, g_canvas.height/2+20);

        ctx.restore();
    }
}
