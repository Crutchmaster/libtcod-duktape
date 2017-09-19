var test = function() {
    this.result = false;
    this.a1 = 0;
    this.a2 = 0;
    this.a3 = 0;
    this.o1 = 0;
    this.o2 = 0;
    this.o3 = 0;
    this.arrSize = 1000000;

    this.render = function() {
        prints(0, 0, "Tests:");
        prints(0, 1, "A: for..in vs for (;;) arrays vs each");
        prints(0, 2, this.a1+" ms;"+this.a2+" ms"+";"+this.a3+" ms");
        prints(0, 3, "I: == objects "+this.o1+" ms");
        prints(0, 4, "I: == strings "+this.o2+" ms");
        prints(0, 5, "I: == ints    "+this.o3+" ms");
    }

    this.control = function(c, k) {
        if (k == key.escape) this.hide();
        if (c == char.a) {
            var arr = [];
            for (var i = 0; i < this.arrSize; i++) {
                arr[i] = i;
            }
            var sum;
            //test 1:
            var start = Date.now();
            for (var i = 0; i < this.arrSize; i++) {sum += arr[i];}
            this.a2 = Date.now() - start;
            //test 2:
            sum = 0;
            start = Date.now();
            for (var i in arr) {
                sum += arr[i];
            }
            this.a1 = Date.now() - start;
            //test 3
            sum = 0;
            start = Date.now();
            arr.forEach(function(v,i) {sum+=v;});
            this.a3 = Date.now() - start;
        }
        if (c == char.i) {
            var obj = {x:0, id:55, str:"longlonglonglonglonglongobjname"};
            var obj2 = obj;
            var sum = 0;
            //test 1
            var start = Date.now();
            for (var i = 0; i < this.arrSize; i++) {
               if (obj == obj2) sum++;
            }
            this.o1 = Date.now() - start;
            //test 2
            sum = 0;
            start = Date.now();
            for (var i = 0; i < this.arrSize; i++) {
                if (obj.str == "longlonglonglonglonglongobjname") sum++;
            }
            this.o2 = Date.now() - start;
            //test 3
            sum = 0;
            start = Date.now();
            for (var i = 0; i < this.arrSize; i++) {
                if (obj.id == 55) sum++;
            }
            this.o3 = Date.now() - start;
        }
    }
    this.init = function() {
        this.show();
        return this.work;
    }
    this.work = function() {
        if (this.closed) return false;
        return true;
    }

    this.run = this.init;
}

test.prototype = new ui.proto(); 
module.exports = test;
