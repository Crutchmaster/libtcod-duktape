var Map = require("js/shooter/map");
var PlayerCtrl = require("js/shooter/playerCtrl");
var Aim = require("js/shooter/aim");


var Battle = function() {
    this.player = {};
    this.units;
    this.map = {};
    this.log = new ui.list(0, 20, 80, 10);
    this.panel = new ui.panel(0, 18, 81, 2);
    this.info = new ui.panel(0, 30, 81, 8);
    this.hitboxpan = {};
    this.quit = false;
    this.closed = false;
    this.global = {};

    this.control = function(c, k) {
        var dx = 0,dy = 0,tx,ty;
        var p = this.player;
        var map = this.map;
        if (c == 113) {this.quit = true;}
        var pAct = p.control(c, k);
        if (pAct == p.unitAct.aim) {
            this.run = this.aim;
        }
        
        if (c == 99) {
            map.allNear(p.x, p.y, function(x, y) {map.closeDoor(x,y)});
        }
        while (p.actTime > 0) this.turn();
        map.compFOV(p.x, p.y, true);
    }
    this.turn = function() {
        this.log.push(this.player.doTurn());
    }

    this.render = function() {
    }

    this.init = function() {
        this.map = new Map();
        this.player = this.map.player;
        this.hitboxpan = new ui.hitboxpanel(40, 3, this.player.hitbox);
        this.player.control = PlayerCtrl;
        this.map.compFOV(this.player.x, this.player.y, true);
        var pan = this.panel;
        pan.setStr("help", 1, 0, "Numkeys - move, a - aim, f - fire, c - close doors, q - quit");
    }

    this.aim = function() {
        this.run = this.shapeAim;
        return new Aim(this.player.x, this.player.y, this.map.playerTargets);
    }

    this.shapeAim = function(res) {
        if (!this.map.fov(res.x, res.y)) {
            return this.mainLoop;
        }
        var u = this.map.getUnit(res.x, res.y);
        if (!u) return this.mainLoop;
        this.hitboxpan.setHitBox(u.hitbox);
        this.player.target = u;
        this.player.firetraj = tcod_gen_line(res.x0, res.y0, res.x, res.y);
        this.run = function(res) {
            this.player.targetAim = {x: res.x, y:res.y};
            this.player.hitboxpan = this.hitboxpan;
            this.hitboxpan.hide();
            return this.mainLoop;
        }
        this.hitboxpan.show();
        return this.hitboxpan;
    }

    this.initRender = function() {
        render.add(this.map);
        render.add(this);
        render.add(this.log);
        //render.add(this.hitboxpan);
        this.panel.show();
        this.info.show();
        return this.mainLoop;
    }

    this.mainLoop = function() {
        this.turn();
        if (this.quit) {
            this.map.destroy();
            this.closed = true;
            this.map.closed = true;
            this.log.closed = true;
            this.hitboxpan.closed = true;
            this.panel.hide();
            this.info.hide();
            return false;
        }
        return true;
    }
    this.run = this.initRender;
    this.init();
}

module.exports = Battle;
