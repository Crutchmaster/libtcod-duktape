var playerCtrl = function(c, k) {
    if (this.actTime >= 0) return;
    var unitAct = this.unitAct;
    this.action = false;
    if (k == key.up || k == key.kp8) this.action = unitAct.walk_fwd;
    if (k == key.down || k == key.kp2) this.action = unitAct.walk_back;
    if (k == key.left || k == key.kp4) this.action = unitAct.turn_left;
    if (k == key.right || k == key.kp6) this.action = unitAct.turn_right;
    if (k == key.kp3 || k == key.kp1) this.action = unitAct.turn_180;
    if (k == key.kp7) this.action = unitAct.turn_left_90;
    if (k == key.kp9) this.action = unitAct.turn_right_90;
    if (c == char.a) this.action = unitAct.aim;
    if (c == char.f) this.action = unitAct.fire;
    if (c == char.r) this.action = unitAct.reload;
    if (c == char.l) this.action = unitAct.look;
    if (c == char.c) this.action = unitAct.closeDoors;
    if (this.action) {
        this.actTime = this.action.time;
        this.actionEnd = false;
    }
    return this.action;
}
module.exports = playerCtrl;
