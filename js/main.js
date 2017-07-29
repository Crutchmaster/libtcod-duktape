enums = require('js/enum');
color = enums.color;
char = enums.tcod_char;
fov_alg = enums.tcod_fov_alg;
align = enums.tcod_align;
key = enums.key;
quit = false;

function onRender() {
}

function quitCondition() {return quit;}

logic.run();
render.render();


function onKeyPress(char_code, key_code) {
    logic.ctrl.control(char_code, key_code);
    render.render();
    logic.run();
    render.render();
}
