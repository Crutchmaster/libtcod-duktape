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
fov_alg = enums.tcod_fov_alg;
quit = false;

function onRender() {
}

function quitCondition() {return quit;}

x = 5;
y = 5;
function mapgen() {
    map_ptr = tcod_new_map(50,50);
    map = [
        "#################################################",
        "#################################################",
        "#######------------###############------------###",
        "#######------------###############------------###",
        "##-----------------###############----###-----###",
        "##-----------------###############----#-##----###",
        "##------#####------###############----#-#-----###",
        "##----------#--------------#######------------###",
        "##------#####-----------##-#######------------###",
        "##--------------------####--------------------###",
        "##-----------------##############################",
        "#################################################"
    ];
    for (var y in map) {
        var s = map[y];
        var trans, walk;
        var c;
        print(s);
        for (var x = 0; x < s.length; x++) {
            c = s.charAt(x)
            trans = (c == "-");
            walk = trans;
            //if (walk) {print("x:"+x+";y:"+y+";w:"+walk);}
            tcod_map_set_prop(map_ptr, x, parseInt(y), trans, walk);
        }
    }
}

function renderMap(px, py) {
    var m;
    tcod_map_compute_fov(map_ptr, parseInt(px), parseInt(py), 15, true, 0);
    for (var y = 0; y < 50; y++) {
        for (var x = 0; x < 50; x++) {
            m = tcod_map_get_prop(map_ptr, x, y);
            if (m.fov) {
                set_default_bg(color["darker_grey"]);
            } else {
                set_default_bg(color["black"]);
            }
            if (m.walkable) {
                tcod_print(x, y, "-");
            } else {
                tcod_print(x, y, "#");
            }
        }
    }
}

function mapWalkable(x, y) {
    var m = tcod_map_get_prop(map_ptr, parseInt(x), parseInt(y));
    return m.walkable;
}

mapgen();
//tcod_map_set_prop(map_ptr, 5, 5, true, true);

function onKeyPress(key, code) {
    print("Key:"+key+" code:"+code);
    put_char(x,y,32);
    var dx=0,dy=0;
    if (code == 14) {dy=-1;}
    if (code == 17) {dy=1;}
    if (code == 15) {dx=-1;}
    if (code == 16) {dx=1;}
    if (mapWalkable(x + dx, y + dy)) {
        x+=dx; y+=dy;
    }

    if (key == 113) {quit = true;}
    if (key == 114) {set_default_fg(color["brass"]);}
    renderMap(x,y);
    put_char(x,y,char["copyright"]);

}
