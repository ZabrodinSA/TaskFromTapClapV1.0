cc.Class({
    extends: cc.Component,

    properties: {
        _winScore: {
            type: cc.Integer,
            default: 0
        },
        _currentScore: {
            type: cc.Integer,
            default:  0
        },
        _numberOfMoves: {
            type: cc.Integer,
            default:  0
        },
        _numberOfStirring: {
            type: cc.Integer,
            default:  1
        },
        numberOfMovesRemainingTextNode: {
            type: cc.Node,
            default:  undefined
        },
        numberOfStirringTextNode: {
            type: cc.Node,
            default:  undefined
        },
        scoreNode: {
            type: cc.Node,
            default:  undefined
        },
        currentScoreTextNode: {
            type: cc.Node,
            default:  undefined
        },
        fieldNode: {
            type: cc.Node,
            default:  undefined
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
        this._numberOfMoves = numberOfMoves
        this.numberOfMovesRemainingTextNode.getComponent(cc.Label).string = 'Осталось\n' + numberOfMoves  
    },

    ReduceTheNumberOfMoves () {
        this._numberOfMoves --
                this.SetNumberOfMoves (this._numberOfMoves)
        if (this._numberOfMoves == 0) {
            this.EndGame () 
        } 
    },

    InitialNumberOfStirring () {
        return this._numberOfStirring
    },

    SetNumberOfStirring (numberOfStirring) {
        this._numberOfStirring = numberOfStirring
        this.numberOfStirringTextNode.getComponent(cc.Label).string = 'ПЕРЕМЕШИВАНИЙ\n' + numberOfStirring
    },

    ReduceTheNumberOfStirring () {
        this._numberOfStirring --
        if (this._numberOfStirring < 0) {
            this._numberOfStirring = 0
        } 
        this.SetNumberOfStirring (this._numberOfStirring)
    },

    InitialWinScore () {
        return Global.width * Global.height
    },

    
    SetWinScore (winScore) {
        this._winScore = winScore
    },

    SetScore (addScore) {
        this._currentScore += addScore
        this.currentScoreTextNode.getComponent(cc.Label).string = this._currentScore + ' / ' + this._winScore
        if (this._currentScore < this._winScore) {
        this.scoreNode.getComponent(cc.ProgressBar).progress = this._currentScore / this._winScore
        } else {
            this.scoreNode.getComponent(cc.ProgressBar).progress = 1
            this.EndGame ()
        }
    },
    
    EndGame () {
        if (this._currentScore >= this._winScore) {
            Global.status = 'Вы выйграли!'
        } else {
            Global.status = 'Вы проиграли'
        }
        this.EndGameAction ()
    },

    EndGameAction () {
        const field = this.fieldNode
        const callFuncAction = cc.callFunc(function () {
            const action = cc.scaleTo (5, 0, 0)
            field.runAction(action)
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
