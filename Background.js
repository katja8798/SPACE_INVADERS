function Background(descr) {

    this.setup(descr);
    this.sprite = this.sprite || g_sprites.background;

    this.cx = g_canvas.width/2;
    this.cy = g_canvas.height/2;
    this.rotation = 0;
    this._scale = 1;

}

Background.prototype.KEY_LEFT   = 'A'.charCodeAt(0);
Background.prototype.KEY_RIGHT  = 'D'.charCodeAt(0);

// Some people might want to use arrow keys ('I' do :] )
Background.prototype.KEY_ARROW_LEFT = 37;
Background.prototype.KEY_ARROW_RIGHT = 39;

Background.prototype = new Entity();

Background.prototype.update = function (du){

    this.cy += du;

    if (keys[this.KEY_LEFT] || keys[this.KEY_ARROW_LEFT]) {
        this.rotation -= du;
    }
    if (keys[this.KEY_RIGHT] || keys[this.KEY_ARROW_RIGHT]) {
        this.rotation += du;
    }

    this.wrapPosition();
}

Background.prototype.render = function (ctx){
    let origScale = this.sprite.scale;
    this.sprite.scale = this._scale;
    this.sprite.drawWrappedCentredAt(
        ctx, this.cx, this.cy, this.rotation
    );
    this.sprite.scale = origScale;
}