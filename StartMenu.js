let KEY_SPACE = ' '.charCodeAt(0);
let KEY_UP = 'W'.charCodeAt(0);
let KEY_DOWN = 'S'.charCodeAt(0);
let KEY_ENTER = 'ENTER'.charCodeAt(0);

let g_start = {
    START : KEY_SPACE,
    UP : KEY_UP,
    DOWN : KEY_DOWN,
    ENTER : KEY_ENTER
};

g_start.render = function (ctx) {

}

g_start.update = function() {
    if (eatKey(this.START)) {

    }
}