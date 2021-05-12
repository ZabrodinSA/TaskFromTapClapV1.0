cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        cc.director.getPhysicsManager().enabled = true
        cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
    cc.PhysicsManager.DrawBits.e_pairBit |
    cc.PhysicsManager.DrawBits.e_centerOfMassBit |
    cc.PhysicsManager.DrawBits.e_jointBit |
    cc.PhysicsManager.DrawBits.e_shapeBit

    var manager = cc.director.getCollisionManager()
    manager.enabled = true
    manager.enabledDebugDraw = true
     },

    start () {

    },

    // update (dt) {},
});
