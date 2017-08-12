var symtab = function() {
    this.closed = false;
    this.control = function(c, k) {
        if (k == key.escape) this.closed = true;
    }
    this.render = function() {
        for (var j = 0; j < 16; j++)
            for (var i = 0; i < 16; i++) {
                print((i+j*16));
                if ((i+j*16) == 37) continue;
                putc(i*5,j,i+j*16)
                prints(i*5+1,j,(i+j*16));
            }
    }
    this.init = function() {
        this.closed = false;
        render.add(this);
        return this.mainLoop;
    }
    this.mainLoop = function() {
        if (this.closed) return false;
        return true;
    }
    this.run = this.init;
}
module.exports = symtab;
