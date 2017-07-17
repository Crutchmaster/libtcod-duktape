#include "wrapper.h"

duk_ret_t js_create_window(duk_context *ctx) {
    int w = duk_get_int(ctx, -5);
    int h = duk_get_int(ctx, -4);
    const char *title = duk_safe_to_string(ctx, -3);
    bool fs = duk_get_boolean(ctx, -2);
    int rt = duk_get_int(ctx, -1);
    TCOD_renderer_t ren = TCOD_RENDERER_GLSL;
    switch (rt) {
        case 1: ren = TCOD_RENDERER_OPENGL; break;
        case 2: ren = TCOD_RENDERER_SDL; break;
    }
    TCOD_console_init_root (w, h, title, fs, ren);
    return 0;
}

