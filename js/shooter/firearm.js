var Bullets = {
    b_9x19 : {
        cal : "9x19",
        damage : 8,
        ap : 0.7,
        recoil : 40
    }
};
var Clip = function(size, cal) {
    this.size = size;
    this.bullets = [];
    this.cal = cal;
    this.bulletType = {};
    this.fill = function(bullet) {
        this.bulletType = bullet;
        this.bullets = [];
        for (var i = 0; i < this.size; i++) {
            this.bullets.push(bullet);
        }
    }
    //this.fill(Bullets.b_9x19);
/*
    this.str = function() {
        return "Clip:"+("|".repeat(this.bullets.length));
    }
*/
    this.out = function(x, y) {
        prints(x, y, "Clip:"+("|".repeat(this.bullets.length)));
    }
}
var Firearm = function(p) {
    if (!p) p = {
            clipSize : 30,
            autofire : true,
            autoShots : 6,
            chamber : true,
            recoil : {v:-0.2, h:0},
            acc : 20,
            brustReAim: 2,
            name : "firearm",
            cal : "9x19"
    }
    this.name = p.name;
    this.clip = new Clip(p.clipSize, p.cal);
    this.autofire = p.autofire;
    this.autoShots = p.autoShots;
    this.chamber = p.chamber ? {} : false;
    this.recoil = p.recoil;
    this.acc = p.acc;
    this.brustSize = 2;
    this.brustReAim = 3;
    this.bulletCnt;
    this.setBrustSize = function(i) {
        var size = i;
        if (i < 2) size = 2;
        if (i > this.autoShots - 1) size = this.autoShots - 1;
        this.brustSize = size;
    }
    this.arm = function(brust) {
        if (this.autofire && brust) this.bulletCnt = rng(this.brustSize - 1, this.brustSize + 1);
        else this.bulletCnt = 1;
    }
    this.fire = function() {
        var bullet = false;
        var dt = {x:0, y:0};
        var dw = {x:0, y:0};
        if (this.clip.bullets.length > 0 && this.bulletCnt > 0) {
            dt.x += this.recoil.h;
            dt.y += this.recoil.v;
            bullet = this.clip.bullets.pop();
            var e = (100 - this.acc);
            dw.x = rng(-e,e) / 500;
            dw.y = rng(-e,e) / 500; 
        }
        this.bulletCnt--;
        return {dt:dt, remain:this.bulletCnt, bullet:bullet, dw:dw};
    }
    this.out = function(x, y) {
        prints(x, y, "Weapon:"+this.name);
    }
}
module.exports = Firearm;

