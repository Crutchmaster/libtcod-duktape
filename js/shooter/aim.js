var Aim = function(parent) {
    this.x0 = 0;
    this.y0 = 0;
    this.x = 0;
    this.y = 0;
    this.targets = [];
    this.enemy = -1;
    this.result = false;
    this.showPath = true;
    this.closed = false;
    this.path = [];
    this.parent = parent;

    this.reset = function() {
        this.x0 = this.x;
        this.y0 = this.y;
        this.enemy = -1;
        this.result = false;
        this.path = [];
        this.show();
    }
    this.setOrig = function(orig) {
        this.x = orig.x;
        this.y = orig.y;
    }
    this.setTargets = function(t) {
        this.targets = t;
    }
    this.get = function() {
        do
        {
            this.parent.render();
            this.control();
        } while (!this.closed);
        this.parent.render();
        this.hide();
        return this.result;
    }
    this.render = function() {
        if (!this.closed) {
            for (var i = 1; i < this.path.length && this.showPath; i++) {
                var n = this.path[i];
                setColor(false, color.red);
                prints(n.x, n.y, "*");
            }
            setColor(false, color.red);
            prints(this.x, this.y, "+");
        }
    }


    this.control = function() {
        var k = read_input_block().keycode;
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
        if (k == key.kp0) {this.targetNext();}
        if (this.x != xo || this.y != yo) this.path = tcod_gen_line(this.x0, this.y0, this.x, this.y);
    }
    this.targetNext = function() {
        if (!this.targets || this.targets.length == 0) return;
        this.enemy++;
        if (this.enemy >= this.targets.length) this.enemy = 0;
        var t = this.targets[this.enemy];
        this.x = t.x;
        this.y = t.y;
    }
}
Aim.prototype = new ui.proto();
module.exports = Aim;
