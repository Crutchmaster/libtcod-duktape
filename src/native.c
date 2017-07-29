#include "native.h"
#include <dirent.h>

duk_ret_t native_print(duk_context *ctx) {
    duk_push_string(ctx, " ");
    duk_insert(ctx, 0);
    duk_join(ctx, duk_get_top(ctx) - 1);
    printf("%s\n", duk_safe_to_string(ctx, -1));
    return 0;
}

duk_ret_t js_read_file(duk_context *ctx) {
    char *f;
    const char *filename = duk_get_string(ctx, 0);
    long size;
    if (read_file(filename, &f, &size)) {
        duk_push_string(ctx, f);
    } else {
        duk_push_string(ctx, NULL);
    }
    return 1;
}

duk_ret_t js_write_file(duk_context *ctx) {
    const char *filename = duk_get_string(ctx, 0);
    const char *data = duk_get_string(ctx, 1);
    bool append = duk_get_boolean_default(ctx, 2, true);
    bool ok = write_file(filename, append, data);
    duk_push_boolean(ctx, ok);
    return 1;
}

duk_ret_t js_read_dir_list(duk_context *ctx) {
    const char *dirname = duk_get_string_default(ctx, 0, ".");
    DIR *d;
    struct dirent *de;
    if ((d = opendir(dirname)) == NULL ) {
        printf("Error. Couldn't open dir %s.\n",dirname);
        duk_push_boolean(ctx, false);
        return 1;
    }
    duk_idx_t ai = duk_push_array(ctx);
    int i = 0;
    while ((de = readdir(d)) != NULL ) {
        if (de->d_type == DT_DIR) {
            duk_push_string(ctx, de->d_name);
            duk_put_prop_index(ctx, ai, i);
            i++;
        }
    }
    closedir(d);
    return 1;
}



bool write_file(const char *filename, bool append, const char *data) {
    FILE *f = fopen(filename, (append ? "a" : "w"));
    if (f == NULL) {
        printf("Error opening %s for write.\n", filename);
        return false;
    }
    fprintf(f, "%s", data);
    fclose(f);
    return true;
}

bool read_file(const char *filename, char **buf, long *size) {
    FILE *fp;
    size_t sz;
    char *b;
    fp = fopen(filename, "rb");
    if (fp == NULL) {
        printf("Error opening %s for read.\n", filename);
        return false;
    }
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

