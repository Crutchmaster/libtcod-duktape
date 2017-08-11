var Renderer = function() {
    this.items = [];
    this.add = function(i) {this.items.push(i);}
    this.render = function() {
        tcod_clear();
        if (this.items.length > 0 && this.items[this.items.length-1].closed) this.items.pop();
        for (var i = 0; i < this.items.length; i++ ) {
            if (!this.items[i].closed) {this.items[i].render();}
        }
    }
}
var Logic = function() {
    this.stack = [];
    this.result = false;
    this.ctrl = {
        control : function(c,k) {}
    }
    this.add = function(i) {this.stack.push(i);}
    this.run = function() {
        var stack = this.stack;
        if (stack.length == 0) {
            quit = true;
        } else {
            var node = stack[stack.length - 1];
            this.ctrl = node;
            var ret = node.run(this.result);
            if (!ret) {
                this.result = node.result;
                stack.pop();
                if (stack.length == 0) {
                    quit = true;
                } else {
                    this.run();
                }
            } else if (typeof(ret) == "object") {
                stack.push(ret);
                this.run();
            } else if (typeof(ret) == "function") {
                node.run = ret;
                this.run();
            }
        }
        this.result = false;
    }
}

var GameSelector = function() {
    this.state = 0;
    this.menu = {};
    this.control = function(c, k) {
        return this.menu.control(c, k);
    }
    this.init = function() {
        var games_list = read_dir_list("js/");
        for (var i = 0; i < games_list.length; i++) {
            var s = games_list[i];
            if (s == "." || s == ".." || s == "lib") {
                games_list.splice(i,1);
                i--;
            }
        }
        this.menu = new ui.menu(5,3,70,20, games_list);
        return this.menuInit;
    }

    this.menuInit = function(ret) {
        if (ret) print(ret);
        this.menu.closed = false;
        this.menu.index = -1;
        render.add(this.menu);
        return this.onMenuSelect;
    }
    this.onMenuSelect = function() {
        if (this.menu.closed) {
            if (this.menu.index >= 0 ) {
                var dirname = this.menu.list[this.menu.index];
                var Game = require("js/"+dirname+"/main");
                this.run = this.menuInit;
                return new Game();
            } else {
                return false;
            }
        }
        return true;
    }


    this.run = this.init;
}
module.exports = {Logic: Logic, Renderer: Renderer, GameSelector: GameSelector};
