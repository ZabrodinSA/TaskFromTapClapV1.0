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
     },

    start () {
        this.numberOfMoves ++
        this.numberOfStirring ++
        this.SetNumberOfMoves ()
        this.SetNumberOfStirring ()
        this.SetScore (0) 
    },

    // update (dt) {},

    SetNumberOfMoves () {
        this.numberOfMoves --
        if (this.numberOfMoves == 0) {
            this.EndGame () 
        } 
        cc.find('Canvas/Moves/NumberOfMovesRemaining/NumberOfMovesRemainingText').getComponent(cc.Label).string = 
        'Осталось\n' + this.numberOfMoves       
    },

    SetNumberOfStirring () {
        this.numberOfStirring --
        if (this.numberOfStirring < 0) {
            this.numberOfStirring = 0
        } 
        cc.find('Canvas/Moves/NumberOfStirring/Background/NumberOfStirringText').getComponent(cc.Label).string = 
        'ПЕРЕМЕШИВАНИЙ\n' + this.numberOfStirring
    },

    SetScore (addScore) {
        this.currentScore += addScore
        cc.find('Canvas/Score/CurrentScoreText').getComponent(cc.Label).string = 
        this.currentScore + ' / ' + this.winScore
        if (this.currentScore >= this.winScore) {
            this.EndGame ()
        }
    },
    
    EndGame () {
        cc.log('End Game')
    }
});
