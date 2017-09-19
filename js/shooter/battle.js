var Map = require("js/shooter/map");
var PlayerCtrl = require("js/shooter/playerCtrl");
var Aim = require("js/shooter/aim");
var Stuff = require("js/shooter/guns");
var Gun = Stuff.guns;
var Ammo = Stuff.bullets;
var Firearm = require("js/shooter/firearm");

var Battle = function() {
    this.player = {};
    this.units;
    this.map = {};
    this.log = new ui.list(0, 20, 80, 10);
    this.panel = new ui.panel(0, 18, 81, 2);
    this.info = new ui.panel(0, 30, 81, 8);
    this.lookPan = new ui.panel(2, 2, 60, 20);
    this.aimui = new Aim();
    this.hitboxpan = {};
    this.quit = false;
    this.closed = false;
    this.global = {};
    this.time = 0;

    this.control = function(c, k) {
        var dx = 0,dy = 0,tx,ty;
        var p = this.player;
        var map = this.map;
        if (c == char.q) {this.quit = true;}
        var pAct = false;
        if (!p.body.dead) pAct = p.control(c, k);
        if (pAct == p.unitAct.aim) this.run = this.aim;
        if (pAct == p.unitAct.look) this.run = this.look;
        
        while (p.actTime > 0) this.turn();
        map.compFOV(p, true);
    }
    this.turn = function() {
        this.time += 10;
        this.log.push(this.player.doTurn());
        for (var i = 0; i < this.map.units.length; i++) {
            var u = this.map.units[i];
            if (u != this.player) {
                u.control();
                this.log.push(u.doTurn());
            }
        }
    }

    this.render = function() {
    }

    this.init = function() {
        this.map = new Map();
        this.player = this.map.player;
        this.player.weapon = new Firearm(Gun.glock17);
        this.player.weapon.clip.fill(Ammo.b_9x19);
        this.player.name = "Player";
        this.hitboxpan = new ui.hitboxpanel(40, 3, this.player.body);
        for (var i in this.map.units) {
            var u = this.map.units[i];
            u.hitboxpan = this.hitboxpan;
            if (u != this.player) {
                u.weapon = new Firearm(Gun.glock17);
                u.weapon.clip.fill(Ammo.b_9x19);
            }
        }
        this.player.control = PlayerCtrl;
        this.map.compFOV(this.player, true);
        var pan = this.panel;
        pan.setStr("help", 1, 0, "Numkeys - move, a - aim, f - fire, r - reload, c - close doors, q - quit");
        this.info.setStr("Weapon", 1, 0, this.player.weapon);
        this.info.setStr("Ammo", 1, 1, this.player.weapon.clip);
        this.info.setStr("Battle", 1, 4, this);
    }

    this.out = function(x, y) {
        var s = Math.floor(this.time/1000);
        var ms = this.time - s * 1000;
        var m = Math.floor(s / 60);
        var h = Math.floor(m / 60);
        var min = m - h * 60;
        var sec = s - m * 60;
        if (h < 10) h = "0" + h;
        if (min < 10) min = "0" + min;
        if (sec < 10) sec = "0" + sec;
        if (ms < 100) ms = "0" + ms;
        if (ms < 10) ms = "0" + ms;
        prints(x, y, "Time: " + h + ":" + min + ":" + sec + ":" + ms);
    }

    this.look = function() {
        this.run = this.lookat;
        this.aimui.setOrig(this.player);
        this.aimui.setTargets(this.map.playerTargets);
        this.aimui.showPath = false;
        this.aimui.reset();
        return this.aimui;
    }

    this.lookat = function(res) {
        if (!this.map.fov(res.x, res.y)) {
            return this.mainLoop;
        }
        var u = this.map.getUnit(res.x, res.y);
        if (!u) return this.mainLoop;
        this.run = this.mainLoop;
        var pan = this.lookPan;
        pan.setStr("Header", 0, 0, "Unit info");
        pan.setStr("Name", 0, 1, "Name:"+u.name);
        pan.setStr("Blood", 0, 2, "Blood:"+u.body.blood);
        pan.setStr("Action", 0, 3, "Action:" + (u.action ? u.action.name : "none"));
        pan.setStr("Facing", 15, 1, "Facing:"+u.getFaceName());
        pan.setStr("ActTime", 15, 3, "Action time:" + u.actTime);
        pan.show();
        return pan;
    }

    this.aim = function() {
        this.run = this.shapeAim;
        this.aimui.setOrig(this.player);
        this.aimui.setTargets(this.map.playerTargets);
        this.aimui.showPath = true;
        this.aimui.reset();
        return this.aimui;

    }

    this.shapeAim = function(res) {
        if (!this.map.fov(res.x, res.y)) {
            return this.mainLoop;
        }
        var u = this.map.getUnit(res.x, res.y);
        if (!u) return this.mainLoop;
        this.hitboxpan.setHitBox(u.body);
        this.player.setTarget(u);
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
