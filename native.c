#include "native.h"

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

