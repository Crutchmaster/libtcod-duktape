var keyCodes = function() {
    this.state = 0;
    this.closed = false;
    this.key = 0;
    this.char = 0;
    this.render = function() {
        setColor(color.black, color.white);
        prints(0,0,"Key code:"+this.key);
        prints(0,1,"Char code:"+this.char);
    }
    this.control = function(c, k) {
        this.char = c;
        this.key = k;
        if (k == key.escape) this.closed = true;
    }
    this.run = function() {
        if (this.state == 0) {
            render.add(this);
            this.state = 1;
        }
        if (this.state == 1) {
            if (this.closed) return false;
        }
        return true;
    }
}
module.exports = keyCodes;
