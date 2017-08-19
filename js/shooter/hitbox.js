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
        "    -SCCCRRRRRCCCS-    ",
        "    -S--CCRRRCC--S-    ",
        "    -S--RRRRxRR--S-    ",
        "    -E--RRRRRRR--E-    ",
        "    -A--rrrlrrr--A-    ",
        "    -A--rrLggrr--A-    ",
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
            "L" : "liver",
            "g" : "guts",
            "f" : "finger",
            "G" : "groin",
            "L" : "leg",
            "k" : "knee",
            "e" : "feet",
            "0" : "eye"
        }
    }
}
var hitbox = function(template_name) {
    this.tpl = templates;
    this.hitbox_tpl = this.tpl[template_name];
    this.hitbox = this.hitbox_tpl.hitbox;
    this.lasthit = [];
    this.clearHits = function() {this.lasthis = [];}
    this.hit = function(x, y) {
        if (!between(y, 0, this.hitbox.length) || !between(x, 0, this.hitbox[y].length)) return false;
        var c = this.hitbox[y].charAt(x);
        if (c == " ") return false;
        this.lasthit.push({x:x, y:y});
        return this.hitbox_tpl.legend[c];
    }
}
module.exports = hitbox;
