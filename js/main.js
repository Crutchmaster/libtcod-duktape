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
function quitCondition() {return quit;}

x = 5;
y = 5;
red = {r:255,g:0,b:0};
green = {r:0,g:255,b:0};
blue = {r:0,g:0,b:255};

function onKeyPress(key, code) {
    print("Key:"+key+" code:"+code);
    put_char(x,y," ");
    if (code == 14) {y--;}
    if (code == 17) {y++;}
    if (code == 15) {x--;}
    if (code == 16) {x++;}
    if (key == 113) {quit = true;}
    if (key == 114) {set_default_fg({r:255,g:0,b:0});}
    put_char(x,y,"@");
}
