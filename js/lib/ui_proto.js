var ui = function() {
    this.closed = false;
    this.parent = null;
    this.childs = [];
    this.addUi = function(newUi) {
        childs.push(newUi);
    }
    this.render = function() {

    }
    this.show = function() {
        this.closed = false;
    }
    this.hide = function() {
        this.closed = true;
    }
}
module.exports = ui;
