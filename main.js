Duktape.errCreate = function (err) {
    try {
        if (typeof err === 'object' &&
            typeof err.message !== 'undefined' &&
            typeof err.lineNumber === 'number') {
            err.message = err.message + ' (line ' + err.lineNumber + ')';
        }
    } catch (e) {
        // ignore; for cases such as where "message" is not writable etc
    }
    return err;
}
i = 0;
function onRender() {
//    set_char(5,5,"h");
//    set_char(6,5,"i");
//    print("render"+(i++));
}
quit = false;
x = 5;
y = 5;

function onKeyPress(key, code) {
    print("Key:"+key+" code:"+code);
    put_char(x,y," ");
    if (code == 14) {y--;}
    if (code == 17) {y++;}
    if (code == 15) {x--;}
    if (code == 16) {x++;}
    if (key == 113) {quit = true;}
    put_char(x,y,"@");

}



/*
print("test,test,test...");
var a=1;
print("a="+a);
print("a+9="+(a+9));
print("test");
*/
