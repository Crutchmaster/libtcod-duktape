#include "duktape.h"
#include "include/libtcod.h"
#include <stdio.h>
#include "native.h"

static duk_ret_t native_print(duk_context *ctx) {
    duk_push_string(ctx, " ");
    duk_insert(ctx, 0);
    duk_join(ctx, duk_get_top(ctx) - 1);
    printf("%s\n", duk_safe_to_string(ctx, -1));
    return 0;
}

static duk_ret_t js_create_window(duk_context *ctx) {
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

static bool read_file(char *filename, char **buf, long *size) {
    FILE *fp;
    size_t sz;
    char *b;
    fp = fopen(filename, "rb");
    fseek(fp, 0L, SEEK_END);
    *size = ftell(fp);
    //printf("size: %ld\n", *size);
    sz = (size_t)*size;
    //printf("size: %d\n", sz);
    rewind(fp);
    b = (char*)malloc(sizeof(char)*(sz+1));
    //printf("buf_addr: %p\n", &b);
    if (!b) return false;
    if (1!=fread( b, sz, 1, fp)) {
        return false;
    }
    /*
    for (char* i = b; i<= b + sizeof(char) * (*size); i+=sizeof(char)) {
        printf("%c",*i);
    }
    printf("\n");
    */
    b[*size]='\0';
    *buf = b;
    fclose(fp);
    return true;
}

void init_TCOD() {
    TCOD_sys_set_fps(30);    
    TCOD_console_init_root (80, 20, "libtcod-duktape", false, TCOD_RENDERER_SDL);

}

int main() {
    duk_context *ctx = duk_create_heap_default();

    duk_push_c_function(ctx, native_print, DUK_VARARGS);
    duk_put_global_string(ctx, "print");

    duk_push_c_function(ctx, js_create_window, DUK_VARARGS);
    duk_put_global_string(ctx, "init_root_console");

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
         TCOD_console_flush();
    }
    
    return 0;
}
