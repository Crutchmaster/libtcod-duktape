var Skills = function() {
    this.firearm = {
        common : {v:0, p:0}, //v-value p-progress
        aim : {v:0, p:0},
        auto : {v:0, p:0},
        handgun : {v:0, p:0},
        smg : {v:0, p:0},
        rifle : {v:0, p:0},
        shotgun : {v:0, p:0}
    };
    this.body = {
        str : {v:30, p:0},
        dex : {v:30, p:0},
        agi : {v:30, p:0},
        vit : {v:30, p:0},
        vis : {v:30, p:0},
        int : {v:30, p:0}
    };
    this.aimError = function(wclass, range, scope) {
        if (!scope) scope = 1;
        if (!wclass) wclass = rifle;
        var dex = this.body.dex.v;
        var vis = this.body.vis.v;
        var aim = this.firearm.aim.v;
        var wpn = this.firearm[wclass].v;
        var roll = rng(0,100);
        var error = 0;
        var e = (roll - dex) / 100; // +-0.7 max
        error += e < 0 ? 0 : e;
        e = (range*10 - vis * scope) / 100;
        error += e < 0 ? 0 : e;
        error = (100 - aim) / 100;
        error = (100 - wpn) / 150;
        return {x: rngf(-error,error), y:rngf(-error,error)};
    }
    this.fireError = function(wclass, bullet) {
        if (!wclass) wclass = rifle;
        if (!bullet) bullet = {recoil : 30};
        var dex = this.body.dex.v;
        var str = this.body.str.v;
        var wpn = this.firearm[wclass].v;
        var roll = rng(0, 100);
        var error = 0;
        var e = (roll - dex) / 200; // +-0.35 max
        error += e < 0 ? 0 : e;
        roll = rng(0, bullet.recoil);
        e = (roll - str) / 100;
        error += e < 0 ? 0 : e;
        error += (100 - wpn) / 300;
        return {x: rngf(-error,error), y:rngf(-error,error)};
    }
    this.brustAim = function(orig, targetAim) {
        var dex = this.body.dex.v;
        var str = this.body.str.v;
        var d = {x:orig.x - targetAim.x , y: orig.y - targetAim.y};
        var max = Math.floor(str / 10);
        if (Math.abs(d.x) > max) d.x = max * sign(d.x);
        if (Math.abs(d.y) > max) d.y = max * sign(d.y);
        var roll = rng(0, 100);
        var e = (roll - dex) / 100;
        e = e < 0 ? 0 : e;
        d.x -= (d.x * e);
        d.y -= (d.y * e);
        return d;
    }
    
}

module.exports = Skills;
