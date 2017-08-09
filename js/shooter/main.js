var Battle = require("js/shooter/battle");
var gameShooter = function() {
    this.mainMenu = {};
    this.init = function() {
        var menuItems = [
            "Test fight",
            "Quit"
        ]
        this.mainMenu = new ui.menu(3,3,40,10, menuItems);
        render.add(this.mainMenu);
        return this.menuRun;
    }
    this.control = function(c, k) {
         return this.mainMenu.control(c, k);
    }
    this.menuRun = function() {
        if (this.mainMenu.closed) {
            var menu = this.mainMenu;
            this.run = this.init;
            if (menu.index < 0) return false;
            if (menu.index == 0) {
                return new Battle();
            }
            if (menu.index == 1) return false;
        }
        return true;
    }
    this.run = this.init;
}

module.exports = gameShooter;
