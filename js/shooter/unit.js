var Hitbox = require("js/shooter/hitbox");
var Firearm = require("js/shooter/firearm");
var Skills = require("js/shooter/skills");
var rotPhase = [0, 1, 1, 1, 0, -1, -1, -1, 0, 1]; //y
             //[1, 1, 0,-1,-1, -1,  0,  1, 1, 1]; x = y + 2;
// \5|6/7(-1)
// -4  -0(8) 
// /3|2\1
var unitAct = {
    stand : {
        time: 100,
        end : function() {}
    },
    walk_fwd : {
        time : 1000,
        end : function() {return this.walk(1);}
    },
    walk_back: {
        time : 1200,
        end : function() {return this.walk(-1);}
    },
    turn_left: {
        time : 200,
        end : function() {return this.turn(-1);}
    },
    turn_right: {
        time : 200,
        end : function() {return this.turn(1);}
    },
    turn_180 : {
        time : 800,
        end : function() {return this.turn(4);}
    },
    turn_left_90 : {
        time : 400,
        end : function() {return this.turn(-2);}
    },
    turn_right_90 : {
        time : 400,
        end : function() {return this.turn(2);}
    },
    fire : {
        time : 100,
        end : function() {return this.fire();}
    },
    aim : {
        time : 300,
        end : function() {return this.aim();}
    }
}

var Unit = function(map) {
    this.unitAct = unitAct;
    this.skill = new Skills();
    this.rotPhase = rotPhase;
    this.hitbox = new Hitbox("human");
    this.weapon = new Firearm();
    this.target = false;
    this.targetAim = {};
    this.firetraj = false;
    this.hitboxpan = false;
    this.x = 0;
    this.y = 0;
    this.map = map;
    this.action = unitAct.stand;
    this.actTime = 0;
    this.actionEnd = true;
    this.control;
    this.dx = 1;
    this.dy = 0;
    this.rotF = 0;
    this.doTurn = function() {
        this.actTime -= 100;
        if (this.actTime <= 0 && !this.actionEnd && this.action) {
            this.actionEnd = true;
            this.doAct = this.action.end;
            return this.doAct();
        }
    }
    this.turn = function(d) {
        this.aimed = false;
        this.rotF += d;
        if (this.rotF < 0) this.rotF += 8;
        if (this.rotF > 7) this.rotF -= 8;
        this.dx = this.rotPhase[this.rotF + 2];
        this.dy = this.rotPhase[this.rotF];
    }
    this.walk = function(m) {
        this.aimed = false;
        var tx = this.x + this.dx * m;
        var ty = this.y + this.dy * m;
        var map = this.map;
        if (map.hasClosedDoor(tx, ty)) {
            map.openDoor(tx, ty);
            map.compFOV(tx, ty);
            return;
        }
        if (map.walkable(tx,ty)) {
            this.x = tx; this.y = ty;
        }
    }
    this.fire = function() {
        if (!this.target) return "No target";
        var range = this.firetraj.length;
        this.hitboxpan.anim = true;
        this.hitboxpan.closed = false;
        var gun;
        this.weapon.setBrustSize(5);
        this.weapon.arm(true);
        var orig = {x: this.targetAim.x, y: this.targetAim.y};
        var aimError = this.skill.aimError("smg",range,1);
        this.targetAim.x += aimError.x;
        this.targetAim.y += aimError.y;
        var c = this.weapon.brustReAim;
        var ret = [];

        while ((gun=this.weapon.fire()).bullet) {
            this.hitboxpan.initBullet();
            c--;
            var x = this.targetAim.x + 0.5, y = this.targetAim.y + 0.5;
            var d = this.skill.fireError("smg", gun.bullet);
            var dw = gun.dw;
            var da = {x:0, y:0};
            if (c == 0) {
                da = this.skill.brustAim(orig, this.targetAim);
                this.targetAim.x += da.x;
                this.targetAim.y += da.y;
                c = this.weapon.brustReAim;
            }
            this.targetAim.x += da.x;
            this.targetAim.x += da.y;
            this.targetAim.x += Math.round((gun.dt.x * range) + (d.x * range));
            this.targetAim.y += Math.round((gun.dt.y * range) + (d.y * range));
            this.hitboxpan.setTarget(this.targetAim);
            for (var i = 0; i < range; i++) {
                x += dw.x, y += dw.y;
                this.hitboxpan.bx = Math.floor(x);
                this.hitboxpan.by = Math.floor(y);
                this.hitboxpan.render();
                tcod_flush();
                sleep(100);
            }
            var hit_part = this.target.hit(Math.floor(x), Math.floor(y));
            this.hitboxpan.render();
            tcod_flush();
            ret.push(hit_part ? "Hit in " + hit_part : "Miss");
        }
        this.hitboxpan.anim = false;
        sleep(200);
        return ret;
    }
    this.aim = function() {
        this.aimed = true;
        return "Aimed";
    }
    this.hit = function(x, y) {
        return this.hitbox.hit(x, y);
    }
}

module.exports = Unit;
