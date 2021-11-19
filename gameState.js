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
    _currState : "start",

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

    getCurrState : function () {
        return this._currState;
    },

    update : function (){
        if (this._currState !== this.states[1]) {
            if (eatKey(this._continueKey)) {
                //In start state
                if (this._currState === this.states[0]) {
                    //Go to play state
                    this._currState = this.states[1];
                    entityManager.changeBackgroundForState(1);

                }
                //In end state
                else if (this._currState === this.states[2] ||
                    this._currState === this.states[3]) {

                    //go to start state
                    this._currState = this.states[0];
                    entityManager.changeBackgroundForState(0);
                }
                levelManager.resetGame();
            }
        }
        else {
            if (levelManager.getCurrLevel() < levelManager.getTotalLevels()) {
                entityManager.changeBackgroundForLvl(levelManager.getCurrLevel());
            }
            if (userInterface.player_health === 0) {
                this._currState = this.states[3];
                entityManager.changeBackgroundForState(6);
            }
            else if (levelManager.getCurrLevel() === levelManager.getTotalLevels()){
                this._currState = this.states[2];
                entityManager.changeBackgroundForState(5);
            }
        }
    },

    render : function (ctx) {
        ctx.save();

        ctx.font = 'bold 40px consolas';
        ctx.lineWidth = .5;
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = "black";

        if (this._currState === this.states[0]) {
            writeTxt(ctx, this._texts[0],2, 2);
            writeTxt(ctx, this._texts[1],2, 1);
        }
        else if (this._currState === this.states[2]) {
            writeTxt(ctx, this._texts[2],3, 3);
            writeTxt(ctx, this._texts[4] + userInterface.getScore(),3, 2);
            writeTxt(ctx, this._texts[5],3, 1);
        }
        else if (this._currState === this.states[3]) {
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
    ctx.fillText(txt, (g_canvas.width-w)/2, g_canvas.height/num+pos*45);

    ctx.strokeStyle = "black";
    ctx.strokeText(txt,(g_canvas.width-w)/2, g_canvas.height/num+pos*45);
}
