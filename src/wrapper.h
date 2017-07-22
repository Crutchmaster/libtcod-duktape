#if !defined(WRAPPER_H_INCLUDED)
#define WRAPPER_H_INCLUDED

#include "duktape.h"
#include "native.h"
#include "../include/libtcod.h"


void init_duk();
void reg_fun(duk_context *ctx, duk_c_function func, char *func_js_name);
int get_int_key_def(duk_context *ctx, char *key, int def);
duk_ret_t js_console_put_char(duk_context *ctx);
duk_ret_t js_console_set_default_bg(duk_context *ctx);
duk_ret_t js_console_set_default_fg(duk_context *ctx);
duk_ret_t js_console_print(duk_context *ctx);

duk_ret_t js_map_new(duk_context *ctx);
duk_ret_t js_map_set_prop(duk_context *ctx);
duk_ret_t js_map_get_prop(duk_context *ctx);
duk_ret_t js_map_compute_fov(duk_context *ctx);

#endif /*WRAPPER_H_INCLUDED*/
