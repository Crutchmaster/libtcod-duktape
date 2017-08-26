var panel = function(x, y, w, h) {
    this.result = false;
    this.box = false;
    this.geometry = {x:x, y:y, w:w, h:h};
    this.elements = {};
    this.fg = color.white;
    this.bg = color.black;

    this.render = function() {
        var g = this.geometry;
        setColor(this.bg, this.fg);
        clearBox(g.x, g.y, g.w, g.h);
        if (this.box) printBox(g.x, g.y, g.w, g.h);
        for (var key in this.elements) {
            var e = this.elements[key];
            setColor(e.bg, e.fg);
            var x = e.x + g.x, y = e.y + g.y;
            if (typeof(e.str) == "object") prints(x, y, e.str.str())
            else prints(x, y, e.str+"");
        }
    }
    this.setStr = function(key, x, y, str, fg, bg) {
        var e = this.elements;
        if (!e[key]) e[key] = {x:0, y:0, str:"", fg:this.fg, bg:this.bg};
        var ek = e[key];
        ek.x = x === false ? ek.x : x; 
        ek.y = y === false ? ek.y : y;
        ek.str = str ? str : ek.str;
        ek.fg = fg ? fg : ek.fg;
        ek.bg = bg ? bg : ek.bg;
    }

}
panel.prototype = new ui.proto();

module.exports = panel;
