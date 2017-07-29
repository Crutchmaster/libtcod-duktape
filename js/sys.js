var Control = function() {
    this.active = {
        control : function(c,k) {}
    }
    this.run = function(c,k) {
        this.active.control(c,k);
    }
}
var Renderer = function() {
    this.items = [];
    this.render = function() {
        tcod_clear();
        if (this.items.length > 0 && this.items[this.items.length-1].closed) this.items.pop();
        for (var i = this.items.length-1; i >= 0; i-- ) {
            if (!this.items[i].closed) {this.items[i].render();}
        }
    }
}
var Logic = function() {
    this.stack = [];
    this.run = function() {
            var stack = this.stack;
            if (stack.length == 0) {
                quit = true;
            } else {
                var ret = stack[stack.length - 1].run(); 
                if (!ret) {
                    stack.pop();
                    if (stack.length == 0) quit = true;
                } else {
                    if (typeof(ret) == "object") {
                        stack.push(ret);
                    }
                }
            }
    }
}
module.exports = {Control: Control, Logic: Logic, Renderer: Renderer};
