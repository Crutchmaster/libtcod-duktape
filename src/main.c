#include "duktape.h"
#include "duk_module_duktape.h"
#include "../include/libtcod.h"
#include <stdio.h>
#include "native.h"
#include "wrapper.h"
#include <pthread.h>

bool quit = false;
int keychar = 0;
int keycode = 0;

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

duk_ret_t js_read_input(duk_context *ctx) {
    duk_idx_t i;
    i = duk_push_object(ctx);
    duk_push_int(ctx, keychar);
    duk_put_prop_string(ctx, i, "keychar");
    duk_push_int(ctx, keycode);
    duk_put_prop_string(ctx, i, "keycode");
    return 1;
}


static void* main_thread(void *arg) {
    duk_context *ctx = arg;
    char *buf;
    long size;
    if (read_file("js/main.js", &buf, &size)) {
        if (duk_peval_string(ctx, buf) != 0) {
            printf("JS error: %s\n", duk_safe_to_string(ctx, -1));
        }
        free(buf);
    }
    return 0;
}

int main() {

    duk_context *ctx = duk_create_heap_default();
    duk_module_duktape_init(ctx);

    init_duk(ctx);
    duk_push_c_function(ctx, js_read_input, DUK_VARARGS);
    duk_put_global_string(ctx, "read_input");

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
/*
    if (read_file("js/main.js", &buf, &size)) {
        if (duk_peval_string(ctx, buf) != 0) {
            printf("JS error: %s\n", duk_safe_to_string(ctx, -1));
        }
        free(buf);
    }
    */

    pthread_attr_t attr;
    pthread_t tid;
    pthread_attr_init(&attr);
    pthread_attr_setstacksize(&attr, 0x100000);
    pthread_create(&tid, &attr, &main_thread, ctx);
    pthread_attr_destroy(&attr);

    while (!TCOD_console_is_window_closed() && !quit) {
//      duk_peval_string_noresult(ctx, "onRender();");
        TCOD_key_t key = TCOD_console_check_for_keypress(TCOD_KEY_PRESSED);
        if (key.vk != TCODK_NONE) {
            keycode = (int)key.c;
            keychar = key.vk;

/*
            duk_push_sprintf(ctx, "onKeyPress(%d,%d);", (int)key.c, key.vk);
            if (duk_peval(ctx) != 0) {
                printf("JS error onKeyPress: %s\n", duk_safe_to_string(ctx, -1));
            }
            */
        }


        TCOD_console_flush();
/*
        if (duk_peval_string(ctx, "quitCondition()") == 0) {
            quit = duk_get_boolean_default(ctx, -1, false);
        }
*/
    }
    
    return 0;
}
