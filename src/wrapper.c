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
    reg_fun(ctx, js_console_put_char, "put_char");
    reg_fun(ctx, js_console_set_default_bg, "set_default_bg");
    reg_fun(ctx, js_console_set_default_fg, "set_default_fg");
    reg_fun(ctx, js_console_print, "tcod_print");

    reg_fun(ctx, js_map_new, "tcod_new_map");
    reg_fun(ctx, js_map_set_prop, "tcod_map_set_prop");
    reg_fun(ctx, js_map_get_prop, "tcod_map_get_prop");

    duk_peval_string_noresult(ctx, "function onRender() {}");
    duk_peval_string_noresult(ctx, "function onKeyPress(key, code) {}");
}

duk_ret_t js_map_new(duk_context *ctx) {
    int w = duk_get_int(ctx, -2);
    int h = duk_get_int(ctx, -1);
    TCOD_map_t *new_map = (TCOD_map_t*)malloc(sizeof(TCOD_map_t)); //TODO REMOVE MEMORY LEAK!
    *new_map = TCOD_map_new(w, h);
    duk_push_pointer(ctx, (void*)new_map);
    return 1;
}

duk_ret_t js_map_set_prop(duk_context *ctx) {
    TCOD_map_t *map = (TCOD_map_t*) duk_get_pointer(ctx, 0);
    int x = duk_get_int_default(ctx, 1, 0);
    int y = duk_get_int_default(ctx, 2, 0);
    bool trans = duk_get_boolean_default(ctx, 3, false);
    bool walk = duk_get_boolean_default(ctx, 4, false);
    TCOD_map_set_properties(*map, x, y, trans, walk);
    return 0;
}

duk_ret_t js_map_get_prop(duk_context *ctx) {
    TCOD_map_t *map = (TCOD_map_t*) duk_get_pointer(ctx, 0);
    int x = duk_get_int_default(ctx, 1, 0);
    int y = duk_get_int_default(ctx, 2, 0);
    bool trans = TCOD_map_is_transparent(*map, x, y);
    bool walk  = TCOD_map_is_walkable(*map, x, y);
    duk_idx_t i;
    i = duk_push_object(ctx);
    duk_push_boolean(ctx, trans);
    duk_put_prop_string(ctx, i, "transparent");
    duk_push_boolean(ctx, walk);
    duk_put_prop_string(ctx, i, "walkable");
    return 1;
}

duk_ret_t js_console_print(duk_context *ctx) {
    int x = duk_get_int(ctx, -3);
    int y = duk_get_int(ctx, -2);
    const char *s = duk_get_string(ctx, -1);
    TCOD_console_print(NULL, x, y, s);
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

