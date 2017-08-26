printBox = function(x, y, w, h) {
    putc(x,y, char.nw);
    putc(x + w - 1, y, char.ne);
    putc(x, y + h - 1, char.sw);
    putc(x + w - 1, y + h - 1, char.se);
    for (var i = x + 1; i < x + w - 1; i++) {
        putc(i, y, char.hline);
        putc(i, y + h - 1, char.hline);
    }
    putc(x + w - 1, y, char.ne);
    for (var i = y + 1; i < y + h - 1; i++) {
        putc(x, i, char.vline);
        putc(x + w - 1, i, char.vline);
    }
}

clearBox = function(x, y, w, h, inner) {
    if (inner) {w -= 2; h -= 2; x--; y--;}
    var tpl = " ".repeat(w - 1);
    for (var j = y; j < y + h; j++) {
        prints(x, j, tpl);
    }
}

ui = {}

ui.proto = require("js/lib/ui_proto");
ui.menu = require("js/lib/menu");
ui.symtab = require("js/lib/symtab");
ui.list = require("js/lib/list");
ui.hitboxpanel = require("js/lib/hitboxpanel");
ui.panel = require("js/lib/panel");

module.exports = ui;
