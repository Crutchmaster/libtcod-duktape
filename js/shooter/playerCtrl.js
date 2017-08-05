var playerCtrl = function(c, k) {
    if (this.actTime >= 0) return;
    var unitAct = this.unitAct;
    if (k == key.up || k == key.kp8) this.action = unitAct.walk_fwd;
    if (k == key.down || k == key.kp2) this.action = unitAct.walk_back;
    if (k == key.left || k == key.kp4) this.action = unitAct.turn_left;
    if (k == key.right || k == key.kp6) this.action = unitAct.turn_right;
    this.actTime = this.action.time;
    this.actionEnd = false;
}
module.exports = playerCtrl;
