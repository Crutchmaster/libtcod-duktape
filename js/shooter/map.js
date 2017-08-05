var Unit = require("js/shooter/unit");
var Door = function() {
    this.closed = true;
}
var Map = function() {
    this.map_ptr;
    this.enemy_pos = [];
    this.player_pos = {};
    this.exit_points = [];
    this.doors = [];
    this.h = 35;
    this.w = 80;
    this.closed = false;
    this.units = [];
    this.player = {};

    this.init = function() {
        this.map_ptr = tcod_new_map(this.w,this.h);
        this.player = new Unit(this);
        this.units.push(this.player);
        this.mapgen();
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
    }
    this.compFOV = function(px, py) {
       tcod_map_compute_fov(this.map_ptr, parseInt(px), parseInt(py), 15, true, 0); 
    }
    this.walkable = function(x, y) {
        var m = tcod_map_get_prop(this.map_ptr, x, y);
        return m.walkable;
    }
    this.setMapProp = function(x, y, trans, walk) {
        tcod_map_set_prop(this.map_ptr, x, y, trans, walk);
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
    this.init();
}
module.exports = Map;
