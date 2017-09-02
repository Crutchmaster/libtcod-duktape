rng = function(min, max) {
    max += 1;
    return Math.floor(Math.random() * (max - min)) + min;
}
rngf = function(min, max) {
    return (Math.random() * (max - min)) + min;
}
sign = function(d) {
    return d < 0 ? -1 : d > 0 ? 1 : 0;
}

between = function(x, min, max) {return (x <= max && x >= min);}
inbound = function(x, min, max) {return x < min ? min : x > max ? max : x;}
getConfig = function(key) {return config[key];}
setColor = function(bg, fg) {
    if (!bg && !fg) {
        bg = color.black;
        fg = color.white;
    }
    if (bg) set_default_bg(bg);
    if (fg) set_default_fg(fg);
}
prints = function(x, y, s) {
    var str = s.toString().replace("%","%%");
    tcod_print(parseInt(x), parseInt(y), str);
}
putc = function(x, y, c) {
    put_char(parseInt(x), parseInt(y), parseInt(c)); 
}
mapWalkable = function(pmap, x, y) {
    var m = tcod_map_get_prop(pmap, parseInt(x), parseInt(y));
    return m.walkable;
}

