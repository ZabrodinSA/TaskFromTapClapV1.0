cc.Class({
    extends: cc.Component,

    properties: {
        blocksMove: {
            type: Boolean,
            default: false
        }
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        cc.director.getPhysicsManager().enabled = true
     },

    start () {
    },

    // update (dt) {},

   
});
