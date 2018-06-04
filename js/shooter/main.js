var Battle = require("js/shooter/battle");
var gameShooter = function() {
    this.mainMenu = {};
    this.init = function() {
        var menuItems = [
            "Test fight",
            "Quit"
        ]
        this.mainMenu = new ui.menu(3,3,40,10, menuItems);
    }
    this.play = function() {
        var n;
        do {
            n = this.mainMenu.get();
            if (n == 0) { //test fight
                new Battle().play();
            }
        } while (n != -1 && n != this.mainMenu.getLastIndex())
    }

    this.init();
}

module.exports = gameShooter;
