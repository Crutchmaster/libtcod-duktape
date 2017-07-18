#include "duktape.h"
#include "duk_module_duktape.h"
#include "../include/libtcod.h"
#include <stdio.h>
#include "native.h"
#include "wrapper.h"


void init_TCOD() {
    TCOD_sys_set_fps(30);    
    TCOD_console_init_root (80, 40, "libtcod-duktape", false, TCOD_RENDERER_SDL);
}

int main() {

    duk_context *ctx = duk_create_heap_default();
    duk_module_duktape_init(ctx);

    init_duk(ctx);

    char *buf;
    long size;
    if (read_file("js/main.js", &buf, &size)) {
        if ( duk_peval_string(ctx, buf) != 0 ) {
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
            if (duk_peval(ctx) != 0) {
                printf("JS error onKeyPress: %s\n", duk_safe_to_string(ctx, -1));
            }
        }
        TCOD_console_flush();
        if (duk_peval_string(ctx, "quitCondition()") == 0) {
            quit = duk_get_boolean_default(ctx, -1, false);
        }
    }
    
    return 0;
}
