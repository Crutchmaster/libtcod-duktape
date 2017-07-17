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
//    print("render"+(i++));
}

function onKeyPress(key, code) {
    print("Key:"+key+" code:"+code);
}

/*
print("test,test,test...");
var a=1;
print("a="+a);
print("a+9="+(a+9));
print("test");
*/
