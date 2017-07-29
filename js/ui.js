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
    this.control = function(c, k) {
        var max = this.list.length - 1;
        print("k:"+k+";c:"+c);
        if (k == key.up) this.idx--;
        if (k == key.down) this.idx++;
        if (k == key.enter) this.submit();
        if (k == key.esc) this.close();
        if (this.idx < 0) this.idx = max;
        if (this.idx > max) this.idx = 0;

    }
    this.submit = function() {
        this.index = this.idx;
        this.closed = true;
    }
    this.close = function() {
        this.closed = true;
    }
    this.render = function() {
        var x = this.x;
        var y = this.y;
        var h = this.h;
        var w = this.w;
        setColor(color.black, color.white);
        //frame
        prints(x, y, "(");//chr(char.ne));
        prints(x+1, y, "-".repeat(w-1)); //chr(char.hline).repeat(w-2));
        prints(x+w, y, ")"); //chr(char.nw));
        for (var i = y+1; i<y+h; i++) {
            prints(x,i, "|"); //chr(char.vline));
            prints(x+w,i,"|"); //chr(char.hline));
        }
        prints(x, y+h, "("); //chr(char.ne));
        prints(x+1, y+h, "-".repeat(w-1)); //chr(char.hline).repeat(w-2));
        prints(x+w, y+h, ")"); //chr(char.nw));
        //items
        prints(x+1, y+1, this.idx);
    }
}


ui = {
    menu: menu
}

module.exports = ui; 
