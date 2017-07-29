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

set_font("fonts/terminal16x16_gs_ro.png",0,true,16,16);
config = {};
config.fps = 30;
config.width = 80;
config.height = 40;
config.title = "ltsdt";

//write_file("test.txt", "testtesttest\n", true);

ui = require('js/ui');
require("js/wrapper");
sys = require("js/sys");

render = new sys.Renderer();
logic = new sys.Logic();
logic.add(new sys.GameSelector());

