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
function getConfig(key) {return config[key];}
function chr(i) {return String.fromCharCode(i);}
function setColor(bg, fg) {
    if (bg) set_default_bg(bg);
    if (fg) set_default_fg(fg);
}
function prints(x, y, s) {
    tcod_print(parseInt(x), parseInt(y), s.toString());
}
Control = function() {
    this.active = {
        control : function(c,k) {}
    }
    this.run = function(c,k) {
        this.active.control(c,k);
    }
}
control = new Control();
Renderer = function() {
    this.items = [];
    this.render = function() {
        for (var i = this.items.length-1; i >= 0; --i ) {
            this.items[i].render();
        }
    }
}
render = new Renderer();
