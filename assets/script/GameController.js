cc.Class({
    extends: cc.Component,

    properties: {
        winScore: {
            type: cc.Integer,
            default: 100
        },
        currentScore: {
            type: cc.Integer,
            default:  0
        },
        numberOfMoves: {
            type: cc.Integer,
            default:  10
        },
        numberOfStirring: {
            type: cc.Integer,
            default:  7
        }
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        cc.director.getPhysicsManager().enabled = true
        cc.log(this.numberOfMoves)

     },

    start () {
        this.SetNumberOfMoves ()
        this.SetNumberOfStirring ()
    },

    // update (dt) {},

    SetNumberOfMoves () {
        cc.find('Canvas/Moves/NumberOfMovesRemaining/NumberOfMovesRemainingText').getComponent(cc.Label).string = 
        'Осталось\n' + this.numberOfMoves
    },

    SetNumberOfStirring () {
        cc.find('Canvas/Moves/NumberOfStirring/Background/NumberOfStirringText').getComponent(cc.Label).string = 
        'ПЕРЕМЕШИВАНИЙ\n' + this.numberOfStirring
    }   
});
