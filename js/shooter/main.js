var Battle = require("js/shooter/battle");
var gameShooter = function() {
    this.state = 0;
    this.mainMenu = {};
    this.init = function() {
        var menuItems = [
            "Test fight",
            "Quit"
        ]
        this.mainMenu = new ui.menu(3,3,40,10, menuItems);

    }
    this.control = function(c, k) {
         return this.mainMenu.control(c, k);
    }
    this.run = function() {
        if (this.state == 0) {
            this.init();
            render.add(this.mainMenu);
            this.state = 1;
        }
        if (this.state == 1) {
            if (this.mainMenu.closed) {
                var menu = this.mainMenu;
                this.state = 0;
                if (menu.index < 0) return false;
                if (menu.index == 0) {
                    return new Battle();
                }
                if (menu.index == 1) return false;
            }
        }
        return true;
    }
}

module.exports = gameShooter;
