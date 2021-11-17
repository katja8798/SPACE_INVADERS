// ======
// ENEMY BULLET
// ======

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic constructor which accepts an arbitrary descriptor object
function EnemyBullet(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    // Make a noise when I am created (i.e. fired)

    playSound(g_sounds.bulletFire);

    /*
        // Diagnostics to check inheritance stuff
        this._bulletProperty = true;
        console.dir(this);
    */

}

EnemyBullet.prototype = new Entity();

// Initial, inheritable, default values

EnemyBullet.prototype.cx = 200;
EnemyBullet.prototype.cy = 200;
EnemyBullet.prototype.velX = 5;
EnemyBullet.prototype.velY = 5;

EnemyBullet.prototype.update = function (du) {

    spatialManager.unregister(this);
    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }

    if (this.cy <= 0) {
        return entityManager.KILL_ME_NOW;
    }

    this.cx += 0 * du;
    this.cy += 5 * du;


    //
    // Handle collisions
    //TODO: Breyta þannig að enemies deyja ekki við sínar eigin bullets!
    //
    //ER að collide-a við skipið?
    //Ef já -drepa skipið
    //Ef nei - gera ekkert
    var hitEntity = this.isHittingShip();
    if (hitEntity) {
        var canTakeHit = hitEntity.takeBulletHit;
        if (canTakeHit) canTakeHit.call(hitEntity);
        //Ef player á bara 1 líf eftir-drepa skipið
        //annars bara minnka lífin
        if(userInterface.player_health===1) {
            console.log("ahah");
            return entityManager.KILL_ME_NOW;
        }
        else{
            userInterface.player_health -=1;
        }
    }

    spatialManager.register(this);
};

EnemyBullet.prototype.getRadius = function () {
    return 4;
};

EnemyBullet.prototype.takeBulletHit = function () {
    this.kill();

    // Make a noise when I am zapped by another bullet
    playSound(g_sounds.bulletZapped);
};

EnemyBullet.prototype.render = function (ctx) {
    g_sprites.enemyBullet.drawCentredAt(
        ctx, this.cx, this.cy
    );

    ctx.globalAlpha = 1;
};

//Fall sem er í samræmi við findHitEntity en á ss bara að finna skipið
EnemyBullet.prototype.isHittingShip = function(){
    let pos = this.getPos();
    return this.findShipInRange(
        pos.posX, pos.posY, this.getRadius()
    );

};

//Fall í samræmi við findEntityInRange en veit ekkki hvort þetta þurfi
//Eða hvort er hægt að nota _findNearestShip?
EnemyBullet.prototype.findShipInRange = function(posX, posY, radius) {
    for (let id in entityManager._ships) {
        let entity = entityManager._ships[id];
        if (entity) {
            let ePosX = entity.posX,
                ePosY = entity.posY,
                eRad = entity.radius;
            if (Math.sqrt(Math.pow(posX - ePosX, 2) + Math.pow(posY - ePosY, 2)) <
                radius + eRad) {
                return entity;
            }
        }
    }
    return false;
};
