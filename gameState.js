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

    _states : ["start", "play","winEnd", "loseEnd"],
    _currState : "start",
    _continueKey : ' '.charCodeAt(0),//space key
    _texts : [
        "WELCOME PILOT",
        "PRESS SPACE TO PLAY",
        "YOU COMPLETED YOUR MISSION",
        "YOU DIED ON YOUR MISSION",
        "FINAL SCORE: ",
        "PRESS SPACE TO CONTINUE"
    ],

    _lastLevelIsFinished : false,

    // PUBLIC METHODS
    checkIfPlaying : function () {
        return this._currState === this._states[1];
    },

    setLastLevelIsFinished : function () {
      this._lastLevelIsFinished = true;
    },

    setLastLevelIsNotFinished : function () {
        this._lastLevelIsFinished = false;
    },

    update : function (){
        if (this.checkIfPlaying()) {
            //change background in accordance to level
            if (levelManager.getCurrLevel() === 0) {
                entityManager.changeBackground(1);
            }else if (levelManager.getCurrLevel() === 1) {
                entityManager.changeBackground(2);
            }else if (levelManager.getCurrLevel() === 2) {
                entityManager.changeBackground(3);
            }else if (levelManager.getCurrLevel() === 3) {
                entityManager.changeBackground(4);
            }

            if (userInterface.player_health === 0) {
                this._currState = this._states[3];
                entityManager.changeBackground(6);
                levelManager.resetGame();
                userInterface.gameOver();
            }
            else if (this._lastLevelIsFinished){
                this._currState = this._states[2];
                entityManager.changeBackground(5);
                levelManager.resetGame();
            }
        }
        else {
            if (eatKey(this._continueKey)) {
                //In start state
                if (this._currState === this._states[0]) {
                    //Go to play state
                    //score and life is reset here so we can still render the score
                    userInterface.gameOver();
                    this._currState = this._states[1];
                    entityManager.changeBackground(1);

                }
                //In end state
                else if (this._currState === this._states[2] ||
                    this._currState === this._states[3]) {
                    //go to start state
                    this._currState = this._states[0];
                    entityManager.changeBackground(0);
                }
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

        if (this._currState === this._states[0]) {
            writeTxt(ctx, this._texts[0],-1);
            writeTxt(ctx, this._texts[1],1);
        }
        else if (this._currState === this._states[2]) {
            writeTxt(ctx, this._texts[2],-1);
            writeTxt(ctx, this._texts[4] + userInterface.getScore(), 0);
            writeTxt(ctx, this._texts[5],1);
        }
        else if (this._currState === this._states[3]) {
            writeTxt(ctx, this._texts[3],-1);
            writeTxt(ctx, this._texts[4] + userInterface.getScore(),0);
            writeTxt(ctx, this._texts[5],1);
        }

        ctx.restore();
    }
}

function writeTxt(ctx,txt, pos) {
    const s = 40;
    ctx.font = 'bold 40px consolas';

    ctx.fillStyle = '#FFFFFF';
    const w = ctx.measureText(txt).width + 5;
    ctx.fillText(txt, (g_canvas.width-w)/2, g_canvas.height/2+pos*s);

    ctx.strokeStyle = "black";
    ctx.strokeText(txt,(g_canvas.width-w)/2, g_canvas.height/2+pos*s);
}
