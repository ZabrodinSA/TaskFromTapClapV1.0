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
        },
        endTime: {
            type: cc.Float,
            default: 3
        }
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        cc.director.getPhysicsManager().enabled = true
     },

    start () {
        this.SetWinScore (this.InitialWinScore ())
        this.SetNumberOfMoves (this.InitialNumberOfMoves ())
        this.SetNumberOfStirring (this.InitialNumberOfStirring ())
        this.SetScore (0) 
    },

    // update (dt) {},

    InitialNumberOfMoves () {
        if (Global.width > Global.height) {
            return Global.width
        } else {
            return Global.height
        }        
    },

    SetNumberOfMoves (numberOfMoves) {
        this.numberOfMoves = numberOfMoves
        cc.find('Canvas/Moves/NumberOfMovesRemaining/NumberOfMovesRemainingText').getComponent(cc.Label).string = 
        'Осталось\n' + numberOfMoves  
    },

    ReduceTheNumberOfMoves () {
        this.numberOfMoves --
        this.SetNumberOfMoves (this.numberOfMoves)
        if (this.numberOfMoves == 0) {
            this.EndGame () 
        } 
    },

    InitialNumberOfStirring () {
        return this.numberOfStirring
    },

    SetNumberOfStirring (numberOfStirring) {
        this.numberOfStirring = numberOfStirring
        cc.find('Canvas/Moves/NumberOfStirring/Background/NumberOfStirringText').getComponent(cc.Label).string = 
        'ПЕРЕМЕШИВАНИЙ\n' + numberOfStirring
    },

    ReduceTheNumberOfStirring () {
        this.numberOfStirring --
        if (this.numberOfStirring < 0) {
            this.numberOfStirring = 0
        } 
        this.SetNumberOfStirring (this.numberOfStirring)
    },

    InitialWinScore () {
        this.winScore = Global.width * Global.height
    },

    
    SetWinScore (winScore) {
        this.WinScore = winScore
    },

    SetScore (addScore) {
        this.currentScore += addScore
        cc.find('Canvas/Score/CurrentScoreText').getComponent(cc.Label).string = 
        this.currentScore + ' / ' + this.winScore
        if (this.currentScore < this.winScore) {
        cc.find('Canvas/Score').getComponent(cc.ProgressBar).progress = 
        this.currentScore / this.winScore
        } else {
            cc.find('Canvas/Score').getComponent(cc.ProgressBar).progress = 1
            this.EndGame ()
        }
    },
    
    EndGame () {
        if (this.currentScore >= this.winScore) {
            Global.status = 'Вы выйграли!'
        } else {
            Global.status = 'Вы проиграли'
        }
        const callFuncAction = cc.callFunc(function () {
            const action = cc.scaleTo (5, 0, 0)
            cc.find('Canvas/Field').runAction(action)
        })
        const callFuncEnd = cc.callFunc(function () {
            cc.director.loadScene('EndGame')
        })
        const delay = cc.delayTime(this.endTime)
        const seq = cc.sequence(callFuncAction, delay, callFuncEnd)
        this.node.runAction(seq)
    },

    NewSize () {
        cc.director.loadScene('StartGame')
    },

    StartOver () {
        cc.director.loadScene('Game')
    }
});
