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
        if (Global.width > Global.height) {
            this.numberOfMoves =  Global.width + 1
        } else {
            this.numberOfMoves = Global.height + 1
        }
        this.numberOfStirring ++
        this.winScore = Global.width * Global.height
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
        var callFuncAction = cc.callFunc(function () {
            var action = cc.scaleTo (5, 0, 0)
            cc.find('Canvas/Field').runAction(action)
        })
        var callFuncEnd = cc.callFunc(function () {
            cc.director.loadScene('EndGame')
        })
        var delay = cc.delayTime(this.endTime)
        var seq = cc.sequence(callFuncAction, delay, callFuncEnd)
        this.node.runAction(seq)
    },

    NewSize () {
        cc.director.loadScene('StartGame')
    },

    StartOver () {
        cc.director.loadScene('Game')
    }
});
