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
    reg_fun(ctx, js_console_put_char, "put_char");
    reg_fun(ctx, js_console_set_default_bg, "set_default_bg");
    reg_fun(ctx, js_console_set_default_fg, "set_default_fg");

    duk_peval_string_noresult(ctx, "function onRender() {}");
    duk_peval_string_noresult(ctx, "function onKeyPress(key, code) {}");
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
    const char *c = duk_get_string(ctx, -1);
    TCOD_console_put_char(NULL, x, y, (int)c[0], TCOD_BKGND_SET);
    return 0;
}

