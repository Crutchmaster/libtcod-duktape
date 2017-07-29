var MapRender = function() {
    this.closed = false;
    this.px;
    this.py;
    this.map_ptr;
    this.render = function() {
        this.renderMap(this.px, this.py);
        this.renderPath();
        prints(this.px,this.py,"@");
    }
    this.renderPath = function() {
        var path = tcod_gen_line(5,5,30,8);
        for (var i in path) {
            var node = path[i];
            prints(node.x, node.y, ".");
        }
    }

    this.renderMap = function(px, py) {
        var m;
        tcod_map_compute_fov(this.map_ptr, parseInt(px), parseInt(py), 15, true, 0);
        for (var y = 0; y < 50; y++) {
            for (var x = 0; x < 50; x++) {
                m = tcod_map_get_prop(this.map_ptr, x, y);
                if (m.fov) {
                    set_default_bg(color["darker_grey"]);
                } else {
                    set_default_bg(color["black"]);
                }
                if (m.walkable) {
                    tcod_print(x, y, "-");
                } else {
                    tcod_print(x, y, "#");
                }
            }
        }
    }

} 

var tcodTest = function() {
    this.state = 0;
    this.player = {x:5, y:5};
    this.map_ptr;
    this.ui = new MapRender();
    this.ui.px = this.player.x;
    this.ui.py = this.player.y;
    this.over = false
    this.init = function() {
        this.mapgen();
    }
    this.run = function() {
        if (this.state == 0) {
            render.add(this.ui);
            this.state = 1;
        } else {
            if (this.over) {
                this.ui.closed = true;
                return false;
            }
            return true;
        }
        return true;
    }
    this.control = function(c, k) {
        var dx=0,dy=0;
        var p = this.player;
        if (k == 14) {dy=-1;}
        if (k == 17) {dy=1;}
        if (k == 15) {dx=-1;}
        if (k == 16) {dx=1;}
        if (mapWalkable(this.map_ptr, p.x + dx, p.y + dy)) {
            p.x+=dx; p.y+=dy;
        }
        if (c == 113) {this.over = true;}
        this.ui.px = p.x;
        this.ui.py = p.y;
        print("px,py:"+p.x+";"+p.y);
    }

    this.mapgen = function() {
        this.map_ptr = tcod_new_map(50,50);
        var map = [
            "#################################################",
            "#################################################",
            "#######------------###############------------###",
            "#######------------###############------------###",
            "##-----------------###############----###-----###",
            "##-----------------###############----#-##----###",
            "##------#####------###############----#-#-----###",
            "##----------#--------------#######------------###",
            "##------#####-----------##-#######------------###",
            "##--------------------####--------------------###",
            "##-----------------##############################",
            "#################################################"
        ];
        for (var y in map) {
            var s = map[y];
            var trans, walk;
            var c;
            for (var x = 0; x < s.length; x++) {
                c = s.charAt(x)
                trans = (c == "-");
                walk = trans;
                tcod_map_set_prop(this.map_ptr, x, parseInt(y), trans, walk);
            }
        }
    this.ui.map_ptr = this.map_ptr;
    }
    this.init();
}



module.exports = tcodTest;
