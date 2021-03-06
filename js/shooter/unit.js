var Body = require("js/shooter/body");
var Firearm = require("js/shooter/firearm");
var Skills = require("js/shooter/skills");
var rotPhase = [0, 1, 1, 1, 0, -1, -1, -1, 0, 1]; //y
             //[1, 1, 0,-1,-1, -1,  0,  1, 1, 1]; x = y + 2;
var sidename = {x: { "-1" : "W", "0": "", "1" : "E"}, y: { "-1" : "N", "0" : "", "1" : "S"}};
// \5|6/7(-1)
// -4  -0(8) 
// /3|2\1
var unitAct = {
    stand : {
        time: 100,
        end : function() {}
    },
    walk_fwd : {
        time : 600,
        end : function() {return this.walk(1);}
    },
    walk_back: {
        time : 800,
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
        time : 500,
        end : function() {return this.aim();}
    },
    reload : {
        time : 2500,
        end : function() {return this.reload();}
    },
    look : {
        time : 10,
        end : function() {return this.look();}
    },
    closeDoors : {
        time : 400,
        end : function() {return this.closeDoors();}
    }
}

for (var actName in unitAct) {
    unitAct[actName].name = actName;
}

var Unit = function(map) {
    this.sidename = sidename;
    this.unitAct = unitAct;
    this.skill = new Skills();
    this.rotPhase = rotPhase;
    this.body = new Body("human");
    this.weapon = null;
    this.target = false;
    this.targetAim = {};
    this.firetraj = false;
    this.hitboxpan = false;
    this.name = "";
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
        this.actTime -= 10;
        if (this.actTime <= 0 && !this.actionEnd && this.action) {
            this.actionEnd = true;
            this.doAct = this.action.end;
            return this.doAct();
        }
    }
    this.control = function() {
        return false;
    }
    this.turn = function(d, fake) {
        if (!fake) {this.aimed = false; this.target = false;}
        this.rotF += d;
        if (this.rotF < 0) this.rotF += 8;
        if (this.rotF > 7) this.rotF -= 8;
        this.dx = this.rotPhase[this.rotF + 2];
        this.dy = this.rotPhase[this.rotF];
    }
    this.getFaceName = function() {
        return this.sidename.x[this.dx] + this.sidename.y[this.dy];
    }
    this.getActionTime = function(action) {
        var ret = action.time;
        if (action == this.unitAct.aim) ret += this.weapon.aimTimeMod;
        if (action == this.unitAct.reload) ret = this.weapon.reloadTime;
        return ret;
    }

    this.walk = function(m) {
        this.aimed = false; this.target = false;
        var tx = this.x + this.dx * m;
        var ty = this.y + this.dy * m;
        var map = this.map;
        if (map.hasClosedDoor(tx, ty)) {
            map.openDoor(tx, ty);
            map.compFOV(this);
            return;
        }
        if (map.walkable(tx,ty)) {
            this.x = tx; this.y = ty;
        }
    }
    this.fire = function() {
        if (!this.target) return "No target";
        var range = this.firetraj.length;
        this.hitboxpan.setHitBox(this.target.body);
        this.hitboxpan.show();
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
            var mapBullet = {traj : this.firetraj, i:0};
            this.map.setBullet(mapBullet);
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
                mapBullet.i = i;
                x += dw.x, y += dw.y;
                this.hitboxpan.bx = Math.floor(x);
                this.hitboxpan.by = Math.floor(y);
                this.map.render();
                this.hitboxpan.render();
                tcod_flush();
                sleep(25);
            }
            var dead = this.target.body.dead;
            var hit_part = this.target.hit(Math.floor(x), Math.floor(y));
            this.map.setBullet(false);
            this.map.render();
            this.hitboxpan.render();
            tcod_flush();
            ret.push(this.name + (hit_part ? " hit in " + hit_part : " miss"));
            if (dead != this.target.body.dead) ret.push(this.target.name + " dead");
        }
        this.hitboxpan.anim = false;
        this.hitboxpan.render();
        tcod_flush();
        sleep(500);
        this.hitboxpan.hide();
        return ret;
    }
    this.setTarget = function(target) {
        this.target = target;
        this.firetraj = tcod_gen_line(this.x, this.y, target.x, target.y);
    }
    this.aim = function() {
        this.aimed = true;
        return this.name+" aimed";
    }
    this.look = function() {
        return this.name+" look";
    }
    this.reload = function() {
        this.weapon.clip.fill(this.weapon.clip.bulletType);
    }
    this.hit = function(x, y) {
        return this.body.hit(x, y);
    }
    this.closeDoors = function() {
        var map = this.map;
        map.allNear(this.x, this.y, function(x, y) {map.closeDoor(x,y)});
    }
}

module.exports = Unit;
