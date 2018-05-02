var ctrl = function() {
    this.result = false;
    this.closed = false; //for render. Set to true to delete from stack.

    this.render = function() {
        //render code
    }

    this.control = function(c, k) {

    }
    this.init = function() {
        //init code
        //render.add(this); add to rendering stack.
        return this.work;
    }
    this.work = function() {
        //return false if work done,
        //this.result = result; to return data
        //return new controller and
        //this.run = func; to get result in func
        return true;
    }
    this.getResult = function(res) {
        //work with this.result from child controller
        return this.work;
    }


    this.run = this.init;
}

module.exports = ctrl;
