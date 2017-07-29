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
    tcod_print(parseInt(x), parseInt(y), s.toString());
}
putc = function(x, y, c) {
    put_char(parseInt(x), parseInt(y), parseInt(c)); 
}
mapWalkable = function(pmap, x, y) {
    var m = tcod_map_get_prop(pmap, parseInt(x), parseInt(y));
    return m.walkable;
}

