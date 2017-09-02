var wound = function(bloodloss_instant, bleed, fatal) {return {bl_inst:bloodloss_instant, bl:bleed, fatal:fatal};}
var templates = {
    human : {
        offset: {x:0, y:0},
        hitbox: [
       //0123456789abcdef01234567
        "        -------        ",
        "        -HHHHH-        ",
        "        -H0H0H-        ",
        "        -MMnMM-        ",
        "        --MMM--        ",
        "    ------NNN------    ",
        "    -SCCClllllCCCS-    ",
        "    -S--lllllll--S-    ",
        "    -S--llllxll--S-    ",
        "    -E--lllllll--E-    ",
        "    -A--llvllll--A-    ",
        "    -A--gvvgggg--A-    ",
        "    -A--ggggggg--A-    ",
        "    -h--bbGGGbb--h-    ",
        "    -f--LL---LL--f-    ",
        "       -LL- -LL-       ",
        "       -LL- -LL-       ",
        "       -LL- -LL-       ",
        "       -kk- -kk-       ",
        "       -LL- -LL-       ",
        "       -LL- -LL-       ",
        "       -LL- -LL-       ",
        "       -LL- -LL-       ",
        "       -ee- -ee-       "
        ],
        legend : {
            "-" : "edge",
            "H" : "head",
            "M" : "mouth",
            "n" : "nose",
            "N" : "neck",
            "C" : "clavicle",
            "S" : "shoulder",
            "E" : "elbow",
            "A" : "arm",
            "h" : "hand",
            "R" : "rib",
            "r" : "false_rib",
            "x" : "heart",
            "l" : "lung",
            "v" : "liver",
            "g" : "guts",
            "f" : "finger",
            "G" : "groin",
            "L" : "leg",
            "k" : "knee",
            "e" : "feet",
            "0" : "eye"
        },
        wounds : {
            "-" : wound(1, 0, false),
            "H" : wound(50, 10, true),
            "M" : wound(10, 8, false),
            "n" : wound(15, 9, false),
            "N" : wound(30, 20, false),
            "C" : wound(10, 6, false),
            "S" : wound(8, 4, false),
            "E" : wound(6, 3, false),
            "A" : wound(6, 3, false),
            "h" : wound(3, 1, false),
            "x" : wound(60, 30, true),
            "l" : wound(20, 10, false),
            "v" : wound(30, 20, false),
            "g" : wound(8, 6, false),
            "f" : wound(1, 1, false),
            "G" : wound(10, 5, false),
            "L" : wound(8, 4, false),
            "k" : wound(7, 4, false),
            "e" : wound(4, 1, false),
            "0" : wound(5, 20, true)

        }
    }
}


var body = function(template_name) {
    this.tpl = templates;
    this.hitbox_tpl = this.tpl[template_name];
    this.hitbox = this.hitbox_tpl.hitbox;
    this.lasthit = [];
    this.blood = 100;
    this.bleed = 0;
    this.wounds = {};
    this.dead = false;
    this.clearHits = function() {this.lasthis = [];}
    this.hit = function(x, y) {
        if (!between(y, 0, this.hitbox.length-1) || !between(x, 0, this.hitbox[y].length-1)) return false;
        var c = this.hitbox[y].charAt(x);
        if (c == " ") return false;
        var wound_id = [c,x,y].join(";");
        var w = this.hitbox_tpl.wounds[c];
        if (w) {
            if (w.fatal) this.dead = true;
            this.blood -= w.bl_inst;
            this.bleed += w.bl;
            if (this.blood <= 0) this.dead = true;
        }
        if (!this.wounds[wound_id]) this.wounds[wound_id] = 1; else
            this.wounds[wound_id]++;
        this.lasthit.push({x:x, y:y});
        return this.hitbox_tpl.legend[c];
    }
}
module.exports = body;
