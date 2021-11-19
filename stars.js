// ======
// STARS
// ======

// Small star object with random position on canvas
const stars = {

    _stars: [],

    // PRIVATE METHODS

    _newStar: function (position) {
        return {
            cx: Math.floor(Math.random() * g_canvas.width),
            cy: position * Math.floor(Math.random() * g_canvas.height),

            velY: Math.floor(Math.random() * 5 + 1),
            radius: 1,
            type: Math.floor(Math.random() * 3)
        };
    },

    // PUBLIC METHODS

    update: function (du) {
        let n = this._stars.length;

        for (let i = 0; i < n; i++) {
            let nextY = this._stars[i].cy + this._stars[i].velY * du;

            if (nextY > g_canvas.width) {
                this._stars.splice(i, 1);
                this._stars.push(this._newStar(0));
            } else {
                this._stars[i].cy = nextY;
            }
        }
    },

    render: function (ctx) {
        for (let i = 0; i < this._stars.length; i++) {
            util.fillCircle(
                ctx,
                this._stars[i].cx,
                this._stars[i].cy,
                this._stars[i].radius,
                "white");
        }
    },

    init: function () {
        for (let i = 0; i < 20; i++) {
            let star = this._newStar(1);
            this._stars.push(star);
        }
    }
};