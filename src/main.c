#include "duktape.h"
#include "duk_module_duktape.h"
#include "../include/libtcod.h"
#include <stdio.h>
#include "native.h"
#include "wrapper.h"

void init_TCOD(int fps, int w, int h, const char *title) {
    TCOD_sys_set_fps(fps);
    TCOD_console_init_root(w, h, title, false, TCOD_RENDERER_SDL);
    TCOD_console_set_background_flag(NULL, TCOD_BKGND_SET);
}

int js_get_int(duk_context *ctx, char *val, int def) {
    int ret = def;
    if (duk_peval_string(ctx, val) == 0) {
        ret = duk_get_int_default(ctx, -1, def);
    }
    return ret;
}

const char* js_get_string(duk_context *ctx, char *val, char *def) {
    const char *ret = def;
    if (duk_peval_string(ctx, val) == 0) {
        ret = duk_get_string_default(ctx, -1, def);
    }
    return ret;
}

int main() {

    duk_context *ctx = duk_create_heap_default();
    duk_module_duktape_init(ctx);

    init_duk(ctx);

    char *buf;
    long size;

    if (read_file("js/init.js", &buf, &size)) {
        if (duk_peval_string(ctx, buf) != 0) {
            printf("JS error: %s\n", duk_safe_to_string(ctx, -1));
        }
        free(buf);
    }

    int fps;
    int width;
    int height;
    const char *title;

    fps = js_get_int(ctx, "getConfig('fps');", 30);
    width = js_get_int(ctx, "getConfig('width');", 80);
    height = js_get_int(ctx, "getConfig('height');", 40);
    title = js_get_string(ctx, "getConfig('title');", "libtcodduktape");

    init_TCOD(fps,width,height,title);

    if (read_file("js/main.js", &buf, &size)) {
        if (duk_peval_string(ctx, buf) != 0) {
            printf("JS error: %s\n", duk_safe_to_string(ctx, -1));
        }
        free(buf);
    }

    return 0;
}
