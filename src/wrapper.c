#include "wrapper.h"

int get_int_key_def(duk_context *ctx, char *key, int def) {
    duk_get_prop_string(ctx, -1, key);
    int ret = duk_get_int_default(ctx, -1, def);
    duk_pop(ctx);
    return ret;
}

void reg_fun(duk_context *ctx, duk_c_function func, char *func_js_name) {
    duk_push_c_function(ctx, func, DUK_VARARGS);
    duk_put_global_string(ctx, func_js_name);
}

void init_duk(duk_context *ctx) {

    reg_fun(ctx, native_print, "print");
    reg_fun(ctx, js_read_file, "read_file");
    reg_fun(ctx, js_write_file, "write_file");
    reg_fun(ctx, js_read_dir_list, "read_dir_list");
    reg_fun(ctx, js_sleep, "sleep");

    reg_fun(ctx, js_console_put_char, "put_char");
    reg_fun(ctx, js_console_set_default_bg, "set_default_bg");
    reg_fun(ctx, js_console_set_default_fg, "set_default_fg");
    reg_fun(ctx, js_console_print, "tcod_print");
    reg_fun(ctx, js_console_print_rect, "tcod_print_rect");
    reg_fun(ctx, js_console_clear, "tcod_clear");
    reg_fun(ctx, js_console_flush, "tcod_flush");

    reg_fun(ctx, js_console_set_font, "set_font");

    reg_fun(ctx, js_map_new, "tcod_new_map");
    reg_fun(ctx, js_map_set_prop, "tcod_map_set_prop");
    reg_fun(ctx, js_map_get_prop, "tcod_map_get_prop");
    reg_fun(ctx, js_map_compute_fov, "tcod_map_compute_fov");
    reg_fun(ctx, js_astar_path, "tcod_astar_path");
    reg_fun(ctx, js_get_line, "tcod_gen_line");

    duk_peval_string_noresult(ctx, "function onRender() {}");
    duk_peval_string_noresult(ctx, "function onKeyPress(key, code) {}");
}

duk_ret_t js_console_clear(duk_context *ctx) {
    TCOD_console_clear(NULL);
    return 0;
}

duk_ret_t js_console_flush(duk_context *ctx) {
    TCOD_console_flush();
    return 0;
}

duk_ret_t js_console_set_font(duk_context *ctx) {
    const char *file = duk_get_string(ctx, 0);
    int row = duk_get_boolean_default(ctx, 1, 0);
    int x = duk_get_int_default(ctx, 2, 0);
    int y = duk_get_int_default(ctx, 3, 0);
    if (row > 2) {row = 2;}
    if (row < 0) {row = 0;}
    int rowflag[3] = {TCOD_FONT_LAYOUT_ASCII_INROW, TCOD_FONT_LAYOUT_ASCII_INCOL, TCOD_FONT_LAYOUT_TCOD};
    bool gs = duk_get_boolean_default(ctx, 2, true);
    int flags = 0;
    flags |= rowflag[row];
    flags |= (gs ? TCOD_FONT_TYPE_GREYSCALE : flags);
    TCOD_console_set_custom_font(file, flags, x, y); 
    return 0;
}

duk_ret_t js_get_line(duk_context *ctx) {
    int fx = duk_get_int(ctx, 0);
    int fy = duk_get_int(ctx, 1);
    int tx = duk_get_int(ctx, 2);
    int ty = duk_get_int(ctx, 3);
    int x,y,i;
    duk_idx_t ai,oi;
    ai = duk_push_array(ctx);
    i = 0;
    TCOD_line_init(fx, fy, tx, ty);
    do {
        oi = duk_push_object(ctx);
        duk_push_int(ctx, x);
        duk_put_prop_string(ctx, oi, "x");
        duk_push_int(ctx, y);
        duk_put_prop_string(ctx, oi, "y");
        duk_put_prop_index(ctx, ai, i);
        i++;
    } while (!TCOD_line_step(&x, &y));
    return 1;
}

duk_ret_t js_astar_path(duk_context *ctx) {
    TCOD_map_t *map = (TCOD_map_t*) duk_get_pointer(ctx, 0);
    int fx = duk_get_int(ctx, 1);
    int fy = duk_get_int(ctx, 2);
    int tx = duk_get_int(ctx, 3);
    int ty = duk_get_int(ctx, 4);
    float diag = duk_get_number_default(ctx, 5, 1.41f);
    TCOD_path_t path = TCOD_path_new_using_map(*map, diag);
    TCOD_path_compute(path, fx, fy, tx, ty);
    duk_idx_t ai,oi;
    ai = duk_push_array(ctx);
    int x,y,i;
    for (i = 0; i < TCOD_path_size(path); i++ ) {
        TCOD_path_get(path, i, &x, &y);
        oi = duk_push_object(ctx);
        duk_push_int(ctx, x);
        duk_put_prop_string(ctx, oi, "x");
        duk_push_int(ctx, y);
        duk_put_prop_string(ctx, oi, "y");
        duk_put_prop_index(ctx, ai, i);
    }
    TCOD_path_delete(path);
    return 1;
}

duk_ret_t js_map_new(duk_context *ctx) {
    int w = duk_get_int(ctx, -2);
    int h = duk_get_int(ctx, -1);
    TCOD_map_t *new_map = (TCOD_map_t*)malloc(sizeof(TCOD_map_t)); //TODO REMOVE MEMORY LEAK!
    *new_map = TCOD_map_new(w, h);
    duk_push_pointer(ctx, (void*)new_map);
    return 1;
}

duk_ret_t js_map_compute_fov(duk_context *ctx) {
    TCOD_map_t *map = (TCOD_map_t*) duk_get_pointer(ctx, 0);
    int x = duk_get_int(ctx, 1);
    int y = duk_get_int(ctx, 2);
    int r = duk_get_int(ctx, 3);
    int walls = duk_get_boolean_default(ctx, 4, true);
    TCOD_fov_algorithm_t algo = (TCOD_fov_algorithm_t)duk_get_int_default(ctx, 5, 0);
    TCOD_map_compute_fov(*map, x, y, r, walls, algo);
    return 0;
}

duk_ret_t js_map_set_prop(duk_context *ctx) {
    TCOD_map_t *map = (TCOD_map_t*) duk_get_pointer(ctx, 0);
    int x = duk_get_int_default(ctx, 1, 0);
    int y = duk_get_int_default(ctx, 2, 0);
    bool trans = duk_get_boolean(ctx, 3);
    bool walk = duk_get_boolean(ctx, 4);
    TCOD_map_set_properties(*map, x, y, trans, walk);
    return 0;
}

duk_ret_t js_map_get_prop(duk_context *ctx) {
    TCOD_map_t *map = (TCOD_map_t*) duk_get_pointer(ctx, 0);
    int x = duk_get_int_default(ctx, 1, 0);
    int y = duk_get_int_default(ctx, 2, 0);
    bool trans = TCOD_map_is_transparent(*map, x, y);
    bool walk  = TCOD_map_is_walkable(*map, x, y);
    bool fov = TCOD_map_is_in_fov(*map, x, y);
    duk_idx_t i;
    i = duk_push_object(ctx);
    duk_push_boolean(ctx, trans);
    duk_put_prop_string(ctx, i, "transparent");
    duk_push_boolean(ctx, walk);
    duk_put_prop_string(ctx, i, "walkable");
    duk_push_boolean(ctx, fov);
    duk_put_prop_string(ctx, i, "fov");
    return 1;
}

duk_ret_t js_console_print(duk_context *ctx) {
    int x = duk_get_int(ctx, -3);
    int y = duk_get_int(ctx, -2);
    const char *s = duk_get_string(ctx, -1);
    TCOD_console_print(NULL, x, y, s);
    return 0;
}

duk_ret_t js_console_print_rect(duk_context *ctx) {
    int x = duk_get_int_default(ctx, 0, 0);
    int y = duk_get_int_default(ctx, 1, 0);
    int w = duk_get_int_default(ctx, 2, 0);
    int h = duk_get_int_default(ctx, 3, 0);
    const char *s = duk_get_string_default(ctx, 4, "");
    TCOD_alignment_t align = (TCOD_alignment_t)duk_get_int_default(ctx, 5, (int)TCOD_LEFT);
    TCOD_bkgnd_flag_t bgflag = (TCOD_bkgnd_flag_t)duk_get_int_default(ctx, 6, (int)TCOD_BKGND_SET);
    TCOD_console_print_rect_ex(NULL, x, y, w, h, bgflag, align, s);
    return 0;
}


duk_ret_t js_console_set_default_bg(duk_context *ctx) {
    int r = get_int_key_def(ctx, "r", 0);
    int g = get_int_key_def(ctx, "g", 0);
    int b = get_int_key_def(ctx, "b", 0);
    TCOD_color_t color = {r,g,b};
    TCOD_console_set_default_background(NULL, color);
    return 0;
}

duk_ret_t js_console_set_default_fg(duk_context *ctx) {
    int r = get_int_key_def(ctx, "r", 0);
    int g = get_int_key_def(ctx, "g", 0);
    int b = get_int_key_def(ctx, "b", 0);
    TCOD_color_t color = {r,g,b};
    TCOD_console_set_default_foreground(NULL, color);
    return 0;
}

duk_ret_t js_console_put_char(duk_context *ctx) {
    int x = duk_get_int(ctx, -3);
    int y = duk_get_int(ctx, -2);
    int c = duk_get_int(ctx, -1);
    TCOD_console_put_char(NULL, x, y, c, TCOD_BKGND_SET);
    return 0;
}

