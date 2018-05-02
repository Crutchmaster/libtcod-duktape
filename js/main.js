enums = require('js/enum');
color = enums.color;
char = enums.tcod_char;
fov_alg = enums.tcod_fov_alg;
align = enums.tcod_align;
key = enums.key;
quit = false;
last_key = 0;

function onRender() {
}

function quitCondition() {return quit;}

//logic.run();
//render.render();


function onKeyPress(char_code, key_code) {
    last_key = key_code;
    logic.ctrl.control(char_code, key_code);
    render.render();
    logic.run();
    render.render();
}
var keys;
while (true) {
    keys = read_input();
    print("Keycode: "+keys.keycode);
}
