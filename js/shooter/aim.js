var Aim = function(x, y) {
    this.x0 = x;
    this.y0 = y;
    this.x = x;
    this.y = y;
    this.result = false;
    this.closed = false; //for render. Set to true to delete from stack.
    this.anim = false;
    this.path = [];
    this.render = function() {
        for (var i = 1; i < this.path.length; i++) {
            var n = this.path[i];
            setColor(false, color.red);
            prints(n.x, n.y, "*");
        }
    }

    this.control = function(c, k) {
        var xo = this.x, yo = this.y;
        if (k == key.up || k == key.kp8) this.y--;
        if (k == key.down || k == key.kp2) this.y++;
        if (k == key.left || k == key.kp4) this.x--;
        if (k == key.right || k == key.kp6) this.x++;
        if (k == key.kp7) {this.y--; this.x--;}
        if (k == key.kp9) {this.y--; this.x++;}
        if (k == key.kp1) {this.y++; this.x--;}
        if (k == key.kp3) {this.y++; this.x++;}
        if (k == key.enter || k == key.kpenter) {this.result = {x:this.x,y:this.y,x0:this.x0,y0:this.y0}; this.closed = true;}
        if (k == key.escape) {this.closed = true;}
        if (this.x != xo || this.y != yo) this.path = tcod_gen_line(this.x0, this.y0, this.x, this.y);
    }
    this.init = function() {
        render.add(this); 
        return this.work;
    }
    this.work = function() {
        if (this.closed) {
            return false;
        }
        return true;
    }

    this.run = this.init;
}

module.exports = Aim;
