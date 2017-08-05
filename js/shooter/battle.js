var Map = require("js/shooter/map");
var PlayerCtrl = require("js/shooter/playerCtrl");


var Battle = function() {
    this.state = 0;
    this.player = {};
    this.map = {};
    this.quit = false;
    this.closed = false;

    this.control = function(c, k) {
        var dx = 0,dy = 0,tx,ty;
        var p = this.player;
        var map = this.map;
        if (c == 113) {this.quit = true;}
        p.control(c, k);
        
        if (c == 99)  {
            map.allNear(p.x, p.y, function(x, y) {map.closeDoor(x,y)});
        }
        while (p.actTime > 0) this.turn();
        map.compFOV(p.x, p.y);
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
        this.map.compFOV(this.player.x, this.player.y);
    }
    this.run = function() {
        if (this.state == 0) {
            render.add(this);
            render.add(this.map);
            this.state = 1;
        }
        if (this.state == 1) {
            this.turn();
            if (this.quit) {
                this.map.destroy();
                this.closed = true;
                this.map.closed = true;
                return false;
            }
        }
        return true;
    }
    this.init();
}

module.exports = Battle;
