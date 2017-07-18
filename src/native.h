#if !defined(NATIVE_H_INCLUDED)
#define NATIVE_H_INCLUDED

#include <stdio.h>
#include <stdbool.h>
#include <stdlib.h>
#include "duktape.h"

bool read_file(char *filename, char **buf, long *size); 
duk_ret_t native_print(duk_context *ctx);

#endif /*NATIVE_H_INCLUDED*/
