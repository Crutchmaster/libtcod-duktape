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
    if (this.action) {
        this.actTime = this.action.time;
        this.actionEnd = false;
    }
}
module.exports = playerCtrl;
