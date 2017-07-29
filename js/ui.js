function printBox(x, y, w, h) {
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

var menu = function(x, y, w, h, list) {
    this.idx = 0;
    this.closed = false;
    this.index = 0;
    this.x = x;
    this.y = y;
    h=h<3?3:h;
    w=w<4?4:w;
    this.w = w;
    this.h = h;
    this.list = list;
    this.start = 0;
    this.control = function(c, k) {
        var max = this.list.length - 1;
        var size = this.h - 2;
        print("k:"+k+";c:"+c);
        if (k == key.up) {
            this.idx--;
            if (this.idx < 0) this.idx = 0;
            if (this.start > this.idx) {this.start = this.idx;}
        }
        if (k == key.down) {
            this.idx++;
            if (this.idx > max) this.idx = max;
            if (this.start + size - 1 < this.idx ) {this.start = this.idx - (size - 1);}
        }
        if (k == key.enter || k == key.kpenter) this.submit();
        if (k == key.escape) this.close();
        print(this.idx);
    }
    this.submit = function() {
        print("Submit");
        this.index = this.idx;
        this.closed = true;
    }
    this.close = function() {
        print("Close");
        this.closed = true;
    }
    this.render = function() {
        var max = this.list.length - 1;
        var x = this.x;
        var y = this.y;
        var h = this.h;
        var w = this.w;
        setColor(color.black, color.white);
        printBox(x, y, w, h);
       //items
        var item_cnt = h - 2;
        for (var i = this.start, ys = y+1; i < this.start+(h-2) && i <= max; i++, ys++) {
            setColor(i == this.idx ? color.grey : color.black);
            prints(x+1, ys, this.list[i]);
        }
        setColor(color.black);
    }
}

var symtab = function(x, y) {
    this.x = x;
    this.y = y;
    this.control = function(c, k) {
    }
    this.render = function() {
        print("symtab_render");
        for (var j = 0; j < 16; j++)
            for (var i = 0; i < 16; i++) {
                print((i+j*16));
                if ((i+j*16) == 37) continue;
                prints(i*4,j,chr(i+j*16)+""+(i+j*16));
            }
    }
}

ui = {
    menu: menu,
    symtab: symtab
}

module.exports = ui; 
