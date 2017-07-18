OBJMOD = obj/duktape.o obj/native.o obj/wrapper.o
APP_NAME = libtcod-duktape
CC = gcc
CFLAGS = -g -Wall -O2 -Wl,-rpath,. -std=c99
CCLIBS = -lm -ltcod
OBJECTS = obj/*.o

%.o: ../src/%.c ../src/%.h
	$(CC) -L. $(CFLAGS) -c $< -o $@ $(CCLIBS)

libtcod-duktape: src/main.c $(OBJMOD)
	$(CC) -L. -o $@ $(CFLAGS) $^ $(CCLIBS)
	
clean:
	rm $(OBJECTS)
	
