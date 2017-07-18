#include "duktape.h"
#include "include/libtcod.h"
#include <stdio.h>
#include "native.h"
#include "wrapper.h"


void init_TCOD() {
    TCOD_sys_set_fps(30);    
    TCOD_console_init_root (80, 40, "libtcod-duktape", false, TCOD_RENDERER_SDL);
}

int main() {
    duk_context *ctx = duk_create_heap_default();

    duk_push_c_function(ctx, native_print, DUK_VARARGS);
    duk_put_global_string(ctx, "print");

    duk_push_c_function(ctx, js_create_window, DUK_VARARGS);
    duk_put_global_string(ctx, "init_root_console");

    duk_push_c_function(ctx, js_console_put_char, DUK_VARARGS);
    duk_put_global_string(ctx, "put_char");

    duk_peval_string_noresult(ctx, "function onRender() {}");
    duk_peval_string_noresult(ctx, "function onKeyPress(key, code) {}");

    char *buf;
    long size;
    //if (TCOD_sys_read_file("main.js", &buf, &size)) {
    if (read_file("main.js", &buf, &size)) {
        //printf("code length: %ld\n%s\n/code\n", size, buf);
        if ( duk_peval_string(ctx, buf) !=0 ) {
            printf("JS error: %s\n", duk_safe_to_string(ctx, -1));
        }
        free(buf);
    }
    bool quit = false;

    init_TCOD();
    while (!TCOD_console_is_window_closed() && !quit) {
        duk_peval_string_noresult(ctx, "onRender();");
        TCOD_key_t key = TCOD_console_check_for_keypress(TCOD_KEY_PRESSED);
        if (key.vk != TCODK_NONE) {
            duk_push_sprintf(ctx, "onKeyPress(%d,%d);", (int)key.c, key.vk);
            duk_peval_noresult(ctx);
        }
        TCOD_console_flush();
        if (duk_peval_string(ctx, "quitCondition()") == 0) {
            quit = duk_get_boolean_default(ctx, -1, false);
        }
    }
    
    return 0;
}
