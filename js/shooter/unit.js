var Hitbox = require("js/shooter/hitbox");
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
        end : function() {this.walk(1);}
    },
    walk_back: {
        time : 1200,
        end : function() {this.walk(-1);}
    },
    turn_left: {
        time : 200,
        end : function() {this.turn(-1);}
    },
    turn_right: {
        time : 200,
        end : function() {this.turn(1);}
    },
    turn_180 : {
        time : 800,
        end : function() {this.turn(4);}
    },
    turn_left_90 : {
        time : 400,
        end : function() {this.turn(-2);}
    },
    turn_right_90 : {
        time : 400,
        end : function() {this.turn(2);}
    }
}

var Unit = function(map) {
    this.unitAct = unitAct;
    this.rotPhase = rotPhase;
    this.hitbox = new Hitbox("human");
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
            this.doAct();
        }
    }
    this.turn = function(d) {
        this.rotF += d;
        if (this.rotF < 0) this.rotF += 8;
        if (this.rotF > 7) this.rotF -= 8;
        this.dx = this.rotPhase[this.rotF + 2];
        this.dy = this.rotPhase[this.rotF];
    }
    this.walk = function(m) {
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
    this.hit = function(x, y) {
        return this.hitbox.hit(x, y);
    }
}

module.exports = Unit;
