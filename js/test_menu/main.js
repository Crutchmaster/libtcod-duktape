var menuTest = function() {
    this.state = 0;
    this.menu = {};
    this.control = function(c, k) {
        return this.menu.control(c, k);
    }
    this.run = function() {
        var state = this.state;
        if (state == 0) {
            this.menu = new ui.menu(3,3,10,5,["a","b","c","e","f","g","h"]);
            render.add(this.menu);
            state = 1;
        }
        if (state == 1) {
            if (this.menu.closed) {
                return false;
            }
        }
        this.state = state;
        return true;
    }
}

module.exports = menuTest;
