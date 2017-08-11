var symtab = function(x, y) {
    this.x = x;
    this.y = y;
    this.control = function(c, k) {
    }
    this.render = function() {
        for (var j = 0; j < 16; j++)
            for (var i = 0; i < 16; i++) {
                print((i+j*16));
                if ((i+j*16) == 37) continue;
                prints(i*4,j,chr(i+j*16)+""+(i+j*16));
            }
    }
}
module.exports = symtab;
