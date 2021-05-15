cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.find('Canvas/EndWindow/Status').getComponent(cc.Label).string = Global.status
    },

    // start () {},

    // update (dt) {},

    NewSize () {
        cc.director.loadScene('StartGame')
    },

    StartOver () {
        cc.director.loadScene('Game')
    }
});
