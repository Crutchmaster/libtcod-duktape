#include "duktape.h"
#include "include/libtcod.h"
#include <stdio.h>
#include "native.h"
#include "wrapper.h"

static duk_ret_t native_print(duk_context *ctx) {
    duk_push_string(ctx, " ");
    duk_insert(ctx, 0);
    duk_join(ctx, duk_get_top(ctx) - 1);
    printf("%s\n", duk_safe_to_string(ctx, -1));
    return 0;
}

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

    init_TCOD();
    while (!TCOD_console_is_window_closed()) {
        duk_peval_string_noresult(ctx, "onRender();");
        TCOD_key_t key = TCOD_console_check_for_keypress(TCOD_KEY_PRESSED);
        if (key.vk != TCODK_NONE) {
            duk_push_sprintf(ctx, "onKeyPress('%c',%d);", key.c, key.vk);
            duk_peval_noresult(ctx);
        }
        TCOD_console_flush();
    }
    
    return 0;
}
