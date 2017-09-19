var aimPoints = [
    {x:12, y:8}
]
var aiActions = {
    guard : {
        control : function() {
            var act = this.unitAct;
            var player = this.map.player;
            if (this.ai.playerFOV) {
                if (!this.aimed) return act.aim;
                this.aimed = false;
                this.setTarget(player);
                var ap = this.ai.aimPoints[rng(0, this.ai.aimPoints.length-1)];
                this.targetAim = {x: ap.x, y: ap.y};
                //this.hitboxpan.setHitBox(player.body);
                return act.fire;
            }

            //this.aimed = false;
            var i = rng(-1, 1);
            if (i == -1) return act.turn_left;
            if (i == 0 ) return act.stand;
            if (i == 1 ) return act.turn_right;
            return false; 
                        
        }
    } 
}
var aiCtrl = function() {
    if (this.body.dead) return false;
    if (this.actTime >= 0) return;
    if (!this.ai) {
        this.ai = {
            actions : aiActions,
            action : aiActions.guard,
            aimPoints : aimPoints
        }
    }
    this.ai.playerFOV = this.map.los(this, this.map.player, true); 
    
    this.action = false;
    //select action
    this.actionControl = this.ai.action.control;
    this.action = this.actionControl();
    if (this.action) {
        this.actTime = this.getActionTime(this.action);
        this.actionEnd = false;
    }
    return this.action;

}
module.exports = aiCtrl;

