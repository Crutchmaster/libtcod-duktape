var bullets = {
    b_9x19 : {
        cal : "9x19",
        damage : 8,
        ap : 0.7,
        recoil : 40
    }
};
var guns = {
    mp5 : {
        name : "mp5",
        clipSize : 30,
        autofire : true,
        autoShots : 6,
        chamber : true,
        recoil : {v:-0.2, h:0},
        acc : 20,
        brustReAim: 2,
        cal : "9x19"
    },
    glock17 : {
        name : "Glock 17",
        clipSize : 15,
        autofire : false,
        autoShots : 0,
        chamber : true,
        recoil : {v:-0.3, h:0},
        acc : 14,
        brustReAim: 0,
        cal : "9x19"
    }
}
module.exports = {guns : guns, bullets : bullets};
