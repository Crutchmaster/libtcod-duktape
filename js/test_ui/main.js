var menuTest = function() {
    this.result = false;
    this.menu = {};
    this.control = function(c, k) {
        return this.menu.control(c, k);
    }
    this.init = function() {
        this.menu = new ui.menu(3,3,10,5,["a","b","c","e","f","g","h"]);
        render.add(this.menu);
        return this.menuWork;
    }
    this.menuWork = function() {
        if (this.menu.closed) {
            this.result = this.menu.idx;
            return false;
        }
        return true;
    }
    this.run = this.init;
}

module.exports = menuTest;
