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
        K: {
            type: cc.Integer,
            default: 2
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
        Global.width = 5
        Global.height = 3
        Global.blocks = new Array (Global.width)
        for (let i = 0; i < Global.blocks.length; i++) {
            Global.blocks[i] = new Array (0)
        }
        this.SetWinScore (this.InitialWinScore ())
        this.SetNumberOfMoves (this.InitialNumberOfMoves ())
        this.SetNumberOfStirring (this.InitialNumberOfStirring ())
        Global.currentScore = 0 
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
        Global.numberOfMoves = numberOfMoves
    },

    ReduceTheNumberOfMoves () {
        Global.numberOfMoves --
        if (Global.numberOfMoves == 0) {
            this.EndGame () 
        } 
    },

    InitialNumberOfStirring () {
        if (Global.width > Global.height) {
            return Global.width - Global.height
        } else {
            return Global.height - Global.width
        }
    },

    SetNumberOfStirring (numberOfStirring) {
        Global.numberOfStirring = numberOfStirring
    },

    ReduceTheNumberOfStirring () {
        Global.numberOfStirring --
        if (Global.numberOfStirring < 0) {
            Global.numberOfStirring = 0
        } 
    },

    InitialWinScore () {
        return Global.width * Global.height
    },

    
    SetWinScore (winScore) {
        Global.winScore = winScore
    },

    AddScore (addScore) {
        Global.currentScore += addScore
        if (Global.currentScore < this._winScore) {

        } else {
            this.EndGame ()
        }
    },

    ClickHandler () {
        cc.log('handlerGame')
    },

    EndGame () {
        if (Global.currentScore >= Global.winScore) {
            Global.status = 'Вы выйграли!'
        } else {
            Global.status = 'Вы проиграли'
        }
        this.fieldNode.getComponent('FieldDestroyer').DestroyField()
    },

    // EndGameAction () {
    //     const field = this.fieldNode
    //     const callFuncAction = cc.callFunc(function () {
    //         const action = cc.scaleTo (5, 0, 0)
    //         field.runAction(action)
    //     })
    //     const callFuncEnd = cc.callFunc(function () {
    //         cc.director.loadScene('EndGame')
    //     })
    //     const delay = cc.delayTime(this.endTime)
    //     const seq = cc.sequence(callFuncAction, delay, callFuncEnd)
    //     this.node.runAction(seq)
    // },

    NewSize () {
        cc.director.loadScene('StartGame')
    },

    StartOver () {
        cc.director.loadScene('Game')
    }
});
