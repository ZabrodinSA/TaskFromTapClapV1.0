cc.Class({
    extends: cc.Component,

    properties: {
        statusNode: {
            type: cc.Node,
            default:  undefined
        },   
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.statusNode.getComponent(cc.Label).string = Global.status
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
