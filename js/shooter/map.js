var Unit = require("js/shooter/unit");
var aiCtrl = require("js/shooter/aiCtrl");
var Door = function() {
    this.closed = true;
}
var Map = function() {
    this.map_ptr;
    this.enemy_pos = [];
    this.player_pos = {};
    this.exit_points = [];
    this.playerTargets = [];
    this.doors = [];
    this.h = 18;
    this.w = 80;
    this.closed = false;
    this.units = [];
    this.player = {};
    this.bullet = false;

    this.init = function() {
        this.map_ptr = tcod_new_map(this.w,this.h);
        this.player = new Unit(this);
        this.units.push(this.player);
        this.mapgen();
        for (var i in this.enemy_pos) {
            var pos = this.enemy_pos[i];
            var enemy = new Unit(this);
            enemy.x = pos.x;
            enemy.y = pos.y;
            enemy.name = "Enemy";
            enemy.control = aiCtrl;
            this.units.push(enemy);
        }
        this.player.x = this.player_pos.x;
        this.player.y = this.player_pos.y;
    }
    this.mapgen = function() {
        var map = [
           //---------|---------|---------|---------|---------|---------|---------|---------|
            "################################################################################",
            "#  #    +   #                  #                 #               !       #     #",
            "X@ #    #  ##    ####   #####  #  ###====#####== #  ###########  ######  #     X",
            "#  +    = ! #                  #           !     #  ###########  ######  #     #",
            "#####  ######   ########  #### #  ===####==###== #  ###########  ######! #     #",
            "#  #    #   #              !   #               ! #       !    !          ###+###",
            "#  #    +   #   ############## +                 #    !  !    ! !        #     #",
            "#  #    #   #             !    #  #===###==##=== +    !  !    ! !        +     #",
            "#  +    # ! #   #############  #           !     #       !    !  ######  ##=##+#",
            "######+######                  #  ##########=### #  ###########  ######  #!    #",
            "#       #          #   #   # ! #                 #  ###########  ######  #     #",
            "#          #       #   #   #   #  ===###======== #  ###########  ######! #######",
            "################+###############        !        #          !            #  +! #",
            "#    =   +     #  #            #  #####========= #               ######  +  #  #",
            "#    =   =        #   =   =   ##                 #  ###########  ######  #######",
            "# !  +   =   #    #   =   =  !=#  ######==###### #  ###########  ######  +  #  #",
            "#    =   =   #    +   =   #    #                 #           !   !       #  +  #",
            "#########################################################################################"
            // # - wall = - window + - door X - exit @ - start player pos. ! - enemy
        ];
        for (var ys in map) {
            var y = parseInt(ys);
            var s = map[y];
            var trans, walk;
            var c;
            for (var x = 0; x < s.length; x++) {
                c = s.charAt(x);
                trans = (c != "#" && c != "+");
                walk = (c == " " || c == "+" || c== "!" || c == "@" || c == "X");
                if (c == "+") {
                    var doors = this.doors;
                    if (!doors[x]) doors[x] = [];
                    doors[x][y] = new Door();
                }
                if (c == "!") {
                    this.enemy_pos.push({x:x,y:y});
                }
                if (c == "@") {
                    this.player_pos = {x:x, y:y};
                }
                if (c == "X") {
                    this.exit_points.push({x:x, y:y});
                }
                tcod_map_set_prop(this.map_ptr, x, y, trans, walk);
            }
        }
    }
    this.destroy = function() {
    }
    this.render = function() {
        var m;
        for (var y = 0; y < this.h; y++) 
            for (var x = 0; x < this.w; x++) {
                m = tcod_map_get_prop(this.map_ptr, x, y);
                if (m.fov) {
                    setColor(color.darker_grey);
                } else {
                    setColor(color.black);
                }
                if (m.walkable) {
                    if (this.doors[x] && this.doors[x][y]) {
                        var d = this.doors[x][y];
                        setColor(false, color.orange);
                        prints(x, y, d.closed ? "+" : "-");
                    } else {
                        prints(x, y, " ");
                    }
                }
                if (m.transparent && !m.walkable) {
                    setColor(false, color.blue);
                    prints(x, y, "=");
                } else if (!m.walkable) {
                    setColor(false, color.grey);
                    prints(x, y, "#");
                }
                

            }
        this.playerTargets = [];
        for (var i in this.units) {
            var u = this.units[i];
            if (u != this.player && this.fov(u.x, u.y)) {
                this.playerTargets.push({x:u.x, y: u.y});
                setColor(color.black, color.red);
                var gl = (u.body.dead ? "%" : "@");
                if (u.body.dead) this.setMapProp(u.x, u.y, true, true);
                prints(u.x, u.y, gl);
                if (!u.body.dead) {
                    setColor(color.black, color.blue);
                    prints(u.x + u.dx, u.y + u.dy, "+");
                }


            }
        }
        
        var p = this.player;
        setColor(color.black, color.white);
        prints(p.x, p.y, p.body.dead ? "%" : "@");
        setColor(color.black, color.red);
        prints(p.x + p.dx, p.y + p.dy, "+");

        if (this.bullet) {
            var b = this.bullet;
            var t = b.traj[b.i];
            setColor(false, color.yellow);
            prints(t.x, t.y, ".");
        }
    }
    this.setBullet = function(b) {this.bullet = b;}
    this.compFOV = function(p, tunnel) {
        if (tunnel) {
            var trans = [];
            var m, x, y;
            p.turn(1, true);
            for (var i = 0; i < 5; i++) {
                p.turn(1, true);
                x = p.x + p.dx;
                y = p.y + p.dy;
                m = this.getMapProp(x, y);
                trans.push({x:x,y:y,t:m.transparent,w:m.walkable});
                this.setMapProp(x, y, false, m.walkable);
            }
            p.turn(2, true);
        }
        tcod_map_compute_fov(this.map_ptr, parseInt(p.x), parseInt(p.y), 100, true, 0);
        if (tunnel) {
            for (var i in trans) {
                var t = trans[i];
                this.setMapProp(t.x, t.y, t.t, t.w);
            }
        }
    }

    this.walkable = function(x, y) {
        var m = tcod_map_get_prop(this.map_ptr, parseInt(x), parseInt(y));
        if (!m.walkable) return false;
        for (var i in this.units) {
            var u = this.units[i];
            if (u != this.player) {
                if (u.x == x && u.y == y && !u.body.dead) return false;
            }
        }
        return true;
    }
    this.fov = function(x, y) {
        var m = tcod_map_get_prop(this.map_ptr, parseInt(x), parseInt(y));
        return m.fov;
    }
    this.los = function(p1, p2, tunnel) {
        var traj = tcod_gen_line(p1.x, p1.y, p2.x, p2.y);
        var check = function(d1, d2) {
            return (d1.x == d2.x) && (d1.y == d2.y);
        }
        for (var i in traj) {
            var p = traj[i];
            if (tunnel && i == 1) {
                var d = { x : p.x - p1.x, y : p.y - p1.y};
                var r1 = false, r2 = false, r3 = false;
                r1 = check(d, {x : p1.dx, y:p1.dy});
                p1.turn(1, true);
                r2 = check(d, {x : p1.dx, y:p1.dy});
                p1.turn(-2, true);
                r3 = check(d, {x : p1.dx, y:p1.dy});
                p1.turn(1, true);
                if (!r1 && !r2 && !r3) return false;
            }
            if (!this.trans(p.x, p.y)) {
                return false;
            }
        }
        //for (var i in traj) {
            //var p = traj[i];
            //print(i+":"+p.x+";"+p.y);
        //}
        //print("Fov checked");
        return true;
    }
    this.trans = function(x, y) {
        var m = tcod_map_get_prop(this.map_ptr, parseInt(x), parseInt(y));
        return m.transparent;
    }
    this.setMapProp = function(x, y, trans, walk) {
        tcod_map_set_prop(this.map_ptr, x, y, trans, walk);
    }
    this.getMapProp = function(x, y) {
        return tcod_map_get_prop(this.map_ptr, x, y);
    }
    this.hasClosedDoor = function(x, y) {
        if (this.doors[x] && this.doors[x][y]) {
            return this.doors[x][y].closed;
        }
        return false;
    }
    this.openDoor = function(x, y) {
        if (this.doors[x] && this.doors[x][y]) {
            this.doors[x][y].closed = false;
            this.setMapProp(x, y, true, true);
        }
    }
    this.closeDoor = function(x, y) {
        if (this.doors[x] && this.doors[x][y]) {
            this.doors[x][y].closed = true;
            this.setMapProp(x, y, false, true);
        }
    }
    this.allNear = function(x, y, f) {
        f(x-1, y-1); f(x, y-1); f(x+1, y-1);
        f(x-1, y); f(x, y); f(x+1, y);
        f(x-1, y+1); f(x, y+1); f(x+1, y+1);
    }
    this.getUnit = function(x, y) {
        for (var i = 0; i < this.units.length; i++) {
            var u = this.units[i];
            if (u.x == x && u.y == y) return u;
        }
        return false;
    }
    this.init();
}
module.exports = Map;
