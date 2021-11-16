function Background(descr) {

    this.setup(descr);
    this.sprite = this.sprite || g_sprites.background;

    this.cx = 0;
    this.cy = 0;
    this.rotation = 0;
    this._scale = 1;
}

Background.prototype = new Entity();

Background.prototype.update = function (du){

    this.cy += du;

    this.wrapPosition();
}

Background.prototype.render = function (ctx){
    let origScale = this.sprite.scale;
    this.sprite.scale = this._scale;
    this.sprite.drawWrappedVerticalCentredAt(
        ctx, this.cx, this.cy, this.rotation
    );
    this.sprite.scale = origScale;
}