var hitboxpanel = function(x, y, hitbox) {
    this.closed = false;
    this.done = false;
    this.x = x;
    this.y = y;
    this.tx = 12;
    this.ty = 12;
    this.w = 26;
    this.h = 26;
    this.hitbox = hitbox;
    this.hitbox_out = [];
    this.control = function(c, k) {
        if (k == key.up || k == key.kp8) this.ty--;
        if (k == key.down || k == key.kp2) this.ty++;
        if (k == key.left || k == key.kp4) this.tx--;
        if (k == key.right || k == key.kp6) this.tx++;
        if (k == key.kp7) {this.ty--;this.tx--;}
        if (k == key.kp9) {this.ty--;this.tx++;}
        if (k == key.kp1) {this.ty++;this.tx--;}
        if (k == key.kp3) {this.ty++;this.tx++;}
        if (k == key.kpenter || k == key.enter) {this.fire();}
 
    }
    this.init = function() {
        this.hitbox_out = [];
        for (var i = 0; i < this.hitbox.hitbox.length; i++) {
            var s = this.hitbox.hitbox[i];
            this.hitbox_out.push(s.replace(/[^ \-]/g,"#"));
        }
        this.closed = false;
        this.done = false;
        return this.mainLoop;
    }
    this.render = function() {
        var x = this.x, y = this.y, w = this.w, h = this.h;
        setColor(color.black, color.white);
        clearBox(x, y, w, h);
        printBox(x, y, w, h);
        for (var i = 0; i < this.hitbox_out.length; i++) {
            prints(x + 1, y + 1 + i, this.hitbox_out[i]);
        }
        setColor(color.black, color.red);
        prints(x+this.tx, y+this.ty, "+");
    }
    this.setHitBox = function(hb) {
        this.hitbox = hb;
    }
    this.fire = function() {
        this.result = {x:this.tx, y:this.ty}
        this.done = true;
    }
    this.mainLoop = function() {
        if (this.done) {
            this.run = this.init;
            return false;
        }
        return true;
    }

    this.run = this.init;

    this.init();
}
module.exports = hitboxpanel;
