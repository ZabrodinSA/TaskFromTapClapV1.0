cc.Class({
    extends: cc.Component,

    properties: {
        blocks: undefined

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {


    },

    start () {

        cc.director.getPhysicsManager().gravity = cc.v2 (0, -640);
        var node = this.node
        
        var rigidBody = node.getComponent(cc.RigidBody)
    },

    // update (dt) {},
});
