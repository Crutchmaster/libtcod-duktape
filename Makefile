SRC_FILES = main.c duktape.c duktape.h duk_config.h
OBJMOD = duktape.o native.o wrapper.o
APP_NAME = libtcod-duktape
CC = gcc
CFLAGS = -g -Wall -O2 -Wl,-rpath,. -std=c99
CCLIBS = -lm -ltcod
OBJECTS = (wildcard ./*.o)

%.o: %.c %.h
	$(CC) -L. $(CFLAGS) -c $< -o $@ $(CCLIBS)

libtcod-duktape: main.c $(OBJMOD)
	$(CC) -L. -o $@ $(CFLAGS) $^ $(CCLIBS)
	
clean:
	rm $(OBJECTS)
	
