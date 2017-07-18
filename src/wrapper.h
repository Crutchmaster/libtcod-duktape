#if !defined(WRAPPER_H_INCLUDED)
#define WRAPPER_H_INCLUDED

#include "duktape.h"
#include "../include/libtcod.h"

duk_ret_t js_create_window(duk_context *ctx); 
duk_ret_t js_console_put_char(duk_context *ctx);

#endif /*WRAPPER_H_INCLUDED*/
