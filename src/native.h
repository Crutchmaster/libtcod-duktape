#if !defined(NATIVE_H_INCLUDED)
#define NATIVE_H_INCLUDED

#include <stdio.h>
#include <stdbool.h>
#include <stdlib.h>
#include "duktape.h"

bool read_file(const char *filename, char **buf, long *size);
bool write_file(const char *filename, bool append, const char *data);


duk_ret_t js_write_file(duk_context *ctx);
duk_ret_t js_read_file(duk_context *ctx);
duk_ret_t native_print(duk_context *ctx);

#endif /*NATIVE_H_INCLUDED*/
