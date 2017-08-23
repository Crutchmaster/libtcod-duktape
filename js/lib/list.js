var list = function(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.stack = [];
    this.border = true;
    this.closed = false;
    this.fg = color.white;
    this.bg = color.black;
    this.push = function(p) {
        var s = [];
        if (typeof(p) == "string") s.push(p);
        else if (typeof(p) == "object") s = p;
        else return;
        for (var i = 0; i < s.length; i++) {
            this.stack.push(s[i]);
            if (this.stack.length > 50) this.stack.shift();
        }
    }
    this.clear = function() {
        this.stack = [];
    }
    this.render = function() {
        setColor(this.bg, this.fg);
        var x = this.x, y = this.y, h = this.h, w = this.w;
        var border = this.border;
        clearBox(x, y, w, h);
        if (border) printBox(x, y, w, h);
        
        var bsize = border ? 2 : 0;
        var hsize = h - bsize; 
        var vsize = w - bsize;
        var offset = border ? 1 : 0;
        for (var i = this.stack.length - 1, dy = 0; dy < hsize && i >= 0; i--,dy++) {
            var s = this.stack[i];
            prints(x + offset, y + h - bsize + offset - dy - 1, s.substr(0,vsize));
        }
    }
}
module.exports = list;
