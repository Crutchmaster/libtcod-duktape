printBox = function(x, y, w, h) {
    putc(x,y, char.nw);
    putc(x+w,y, char.ne);
    putc(x,y+h-1, char.sw);
    putc(x+w,y+h-1, char.se);
    for (var i = x + 1; i < x + w; i++) {
        putc(i, y, char.hline);
        putc(i, y+h-1, char.hline);
    }
    putc(x+w,y, char.ne);
    for (var i = y+1; i<y+h-1; i++) {
        putc(x,i, char.vline);
        putc(x+w,i, char.vline);
    }
}

var menu = require("js/lib/menu");
var symtab = require("js/lib/symtab");
var list = require("js/lib/list");
ui = {
    menu: menu,
    symtab: symtab,
    list: list
}

module.exports = ui; 
