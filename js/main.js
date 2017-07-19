Duktape.errCreate = function (err) {
    try {
        if (typeof err === 'object' &&
            typeof err.message !== 'undefined' &&
            typeof err.lineNumber === 'number') {
            err.message = err.message + ' (line ' + err.lineNumber + ')';
        }
    } catch (e) {
        // ignore; for cases such as where "message" is not writable etc
    }
    return err;
}

Duktape.modSearch = function (id) {
    print('Loading module:', id);
    return read_file(id+".js");  //TODO: Fix segfault if file not found
}

enums = require('js/enum');
color = enums.color;
char = enums.tcod_char;
quit = false;

function onRender() {
}

function quitCondition() {return quit;}

x = 5;
y = 5;
map = tcod_new_map(50,50);
tcod_map_set_prop(map, 15, 15, true, false);
tcod_map_set_prop(map, 16, 15, true, true);
var r = tcod_map_get_prop(map, 15, 15);
print("r_trans:"+r.transparent);
print("r_walk:"+r.walkable);
print("r:"+r);


function onKeyPress(key, code) {
    print("Key:"+key+" code:"+code);
    put_char(x,y,32);
    if (code == 14) {y--;}
    if (code == 17) {y++;}
    if (code == 15) {x--;}
    if (code == 16) {x++;}
    if (key == 113) {quit = true;}
    if (key == 114) {set_default_fg(color["brass"]);}
    tcod_print(10,2, "Test...-------_______@@@@!!!()()====++");
    put_char(x,y,char["copyright"]);

}
