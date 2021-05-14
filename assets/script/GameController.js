cc.Class({
    extends: cc.Component,

    properties: {
        winScore: {
            type: cc.Integer,
            default: 0
        },
        currentScore: {
            type: cc.Integer,
            default:  0
        },
        numberOfMoves: {
            type: cc.Integer,
            default:  0
        },
        numberOfStirring: {
            type: cc.Integer,
            default:  0
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
