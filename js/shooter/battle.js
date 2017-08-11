var Map = require("js/shooter/map");
var PlayerCtrl = require("js/shooter/playerCtrl");
var Aim = require("js/shooter/aim");

var Battle = function() {
    this.player = {};
    this.units;
    this.map = {};
    this.log = new ui.list(0, 20, 80, 10);
    this.quit = false;
    this.closed = false;

    this.control = function(c, k) {
        var dx = 0,dy = 0,tx,ty;
        var p = this.player;
        var map = this.map;
        if (c == 113) {this.quit = true;}
        if (c == 102) {this.run = this.aim;}
        p.control(c, k);
        
        if (c == 99)  {
            map.allNear(p.x, p.y, function(x, y) {map.closeDoor(x,y)});
        }
        while (p.actTime > 0) this.turn();
        map.compFOV(p.x, p.y, true);
    }
    this.turn = function() {
        this.player.doTurn();
    }

    this.render = function() {
        setColor(color.black, color.white);
        var p = this.player;
        prints(p.x, p.y, "@");
        setColor(color.black, color.red);
        prints(p.x+p.dx, p.y+p.dy, "+");
    }

    this.init = function() {
        this.map = new Map();
        this.player = this.map.player;
        this.player.control = PlayerCtrl;
        this.map.compFOV(this.player.x, this.player.y, true);
    }

    this.aim = function() {
        this.run = this.fire;
        return new Aim(this.player.x, this.player.y);
    }

    this.fire = function(res) {
        if (this.map.fov(res.x, res.y)) {
            this.log.push("Fire x:"+res.x+" y:"+res.y);
        } else {
            this.log.push("Not in fov");
        }
        return this.mainLoop;
    }

    this.initRender = function() {
        render.add(this.map);
        render.add(this);
        render.add(this.log);
        return this.mainLoop;
    }

    this.mainLoop = function() {
        this.turn();
        if (this.quit) {
            this.map.destroy();
            this.closed = true;
            this.map.closed = true;
            this.log.closed = true;
            return false;
        }
        return true;
    }
    this.run = this.initRender;
    this.init();
}

module.exports = Battle;
