#include "native.h"

duk_ret_t native_print(duk_context *ctx) {
    duk_push_string(ctx, " ");
    duk_insert(ctx, 0);
    duk_join(ctx, duk_get_top(ctx) - 1);
    printf("%s\n", duk_safe_to_string(ctx, -1));
    return 0;
}

duk_ret_t js_read_file(duk_context *ctx) {
    char *f;
    const char *filename = duk_get_string(ctx, -1);
    long size;
    if (read_file(filename, &f, &size)) {
        duk_push_string(ctx, f);
    } else {
        duk_push_string(ctx, NULL);
    }
    return 1;
}

bool read_file(const char *filename, char **buf, long *size) {
    FILE *fp;
    size_t sz;
    char *b;
    fp = fopen(filename, "rb");
    fseek(fp, 0L, SEEK_END);
    *size = ftell(fp);
    sz = (size_t)*size;
    rewind(fp);
    b = (char*)malloc(sizeof(char)*(sz+1));
    if (!b) return false;
    if (1!=fread( b, sz, 1, fp)) {
        return false;
    }
    b[*size]='\0';
    *buf = b;
    fclose(fp);
    return true;
}

