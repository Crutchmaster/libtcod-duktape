enums = require('js/enum');
color = enums.color;
char = enums.tcod_char;
fov_alg = enums.tcod_fov_alg;
align = enums.tcod_align;
key = enums.key;
last_key = 0;

var keys;

/*
setColor(color.darker_grey);
tcod_clear();
tcod_flush();
i=0
var quit = false;
while (!game_window_closed() && !quit) {
    i++;
    keys = read_input_block();
    tcod_clear();
    print("Key: "+"("+keys.keycode+")"+String.fromCharCode(keys.keychar));
    prints(5,5,"Keycode:"+keys.keycode+" i:"+i);
    quit = keys.keycode == 1;
    tcod_flush();
}
*/
/*
var ret = new ui.menu(5,5,50,10,["one","two","three","four"]).get();
print("Ret:"+ret);
*/
var gs = new sys.GameSelector();
var game;
while (game = gs.getGame()) {
    tcod_clear();
    game.play();
    tcod_clear();
}

