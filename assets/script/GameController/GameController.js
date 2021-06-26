const { Game } = require("../GameClass");

cc.Class({
    extends: cc.Component,

    properties: {
        numberOfPossibleMovesTextNode: {
            type: cc.Node,
            default:  undefined
        },
        numberOfMovesTextNode: {
            type: cc.Node,
            default:  undefined
        },
        numberOfMixingTextNode: {
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
        const fieldControl = this.fieldNode.getComponent('FieldControl')
        fieldControl.MouseOff()
        fieldControl.FieldRender()
        this.RenderGame()
    },

    // update (dt) {},

    RenderGame () {
        this.SetNumberOfMoves(game.numberOfMoves)
        this.SetNumberOfPossibleMoves(game.numberOfPossibleMoves)
        this.SetNumberOfMixing(game.numberOfMixing)
        this.SetScore(game.winScore, game.curScore)   
        this.CheckEndGame ()     
    },

    SetNumberOfMoves (numberOfMoves) {
        const numberOfMovesText = this.numberOfMovesTextNode.getComponent(cc.Label)
        numberOfMovesText.string = 'Осталось\n' + numberOfMoves
    },

    SetNumberOfPossibleMoves (numberOfPossibleMoves) {
        const numberOfMovesPossibleText = this.numberOfPossibleMovesTextNode.getComponent(cc.Label)
        numberOfMovesPossibleText.string = 'Доступно\n' + numberOfPossibleMoves
    },

    SetNumberOfMixing (numberOfMixing) {
        const numberOfMixingText = this.numberOfMixingTextNode.getComponent(cc.Label)
        numberOfMixingText.string = 'ПЕРЕМЕШИВАНИЙ\n' + numberOfMixing
    },
  
    SetScore (winScore, currentScore) {
        const currentScoreText = this.currentScoreTextNode.getComponent(cc.Label)
        currentScoreText.string = currentScore + ' / ' + winScore
    },

    Mixing () {
        const fieldControl = this.fieldNode.getComponent('FieldControl')

        if (fieldControl._mouseOn) {
            if (game.Mixing()) {
                fieldControl.MouseOff()
                fieldControl._mixingTime = 0
                fieldControl.BlocksRender()
                this.RenderGame()
            }
        }
    },    

    CheckEndGame () {
        if (game.statusGame != 'game is on') {
            this.EndGameAction ()
        } 
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
        const columns = game.field.numberOfColumns
        const lines = game.field.numberOfLines
        game = new Game (columns, lines)
        cc.director.loadScene('Game')
    }
});
