var ui = function() {
    this.closed = false;
    this.show = function() {
        render.add(this);
        this.closed = false;
    }
    this.hide = function() {
        this.closed = true;
    }
}
module.exports = ui;
