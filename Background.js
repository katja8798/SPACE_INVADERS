function Background(descr) {

    this.setup(descr);
    this.sprite = this.sprite || g_sprites.background;

    this.cx = 0;
    this.cy = this.sprite.height;
    this.rotation = 0;
    this._scale = 1;

}

Background.prototype = new Entity();

Background.prototype.update = function (du){

    if (this.cy <= this.sprite.height) {
        this.cy += du;
    }
    else {
        this.cy += du - this.sprite.height;
    }

}

Background.prototype.render = function (ctx){
    let origScale = this.sprite.scale;
    this.sprite.scale = this._scale;

    this.sprite.drawAt(ctx, this.cx, this.cy, this.rotation);

    var sh = g_canvas.height;
    this.sprite.drawAt(ctx, this.cx, this.cy - this.sprite.height, this.rotation);
    //this.sprite.drawAt(ctx, this.cx, this.cy + sh, this.rotation);

    this.sprite.scale = origScale;
    stars.render(ctx);
}