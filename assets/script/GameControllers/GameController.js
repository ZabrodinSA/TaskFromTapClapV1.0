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
        L: {
            type: cc.Integer,
            default: 3
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
        Global.width = 10
        Global.height = 10
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

    ClickHandler (column, line) {
        const fieldControl = this.fieldNode.getComponent('FieldControl')
        let omittedBlocks = []
        let notOmittedBlocks = []
        let indexClickBlock

        for (let i = 0; i < Global.blocks.length; i++) {
            for (let j = 0; j < Global.blocks[i].length; j++) {
                const blockController = Global.blocks[i][j].getComponent('BlockController')
                if (blockController._blockOmitted) {
                    if (i == column && j == line) {
                        indexClickBlock = omittedBlocks.length
                    }
                    omittedBlocks.push(Global.blocks[i][j])
                } else {
                    notOmittedBlocks.push(Global.blocks[i][j])
                }
            }
        }
        
        if (omittedBlocks.length >= this.L) {
            const block = omittedBlocks[indexClickBlock]
            const blockController = block.getComponent('BlockController')
            omittedBlocks.splice(indexClickBlock, 1)
            notOmittedBlocks.push(block)
            blockController.MakeSuperBlock ()
            // fieldControl.CreatingSuperBlock (column, line)
        }
        cc.log(`${omittedBlocks.length} ${notOmittedBlocks.length}`)
        if (omittedBlocks.length >= this.K) {                
            // this.AddScore (allOmittedBlocks.length)
            this.DeleteBlocksFromGlobal (omittedBlocks)
            fieldControl.DestroyBlocks (omittedBlocks, notOmittedBlocks)
        }
    },

    DeleteBlocksFromGlobal (omittedBlocks) {
        for (let i = 0; i < omittedBlocks.length; i++) {
            const blockController = omittedBlocks[i].getComponent('BlockController')
            Global.blocks[blockController._column].splice(blockController._line, 1)  
            
            for (let j = 0; j < Global.blocks[blockController._column].length; j++) {
                const block = Global.blocks[blockController._column][j]
                const _blockController = block.getComponent('BlockController') 
                block.zIndex = j               
                _blockController._line = j 
            }
        }      
    },

    Mixing () {
        const fieldControl = this.fieldNode.getComponent('FieldControl')

        if (fieldControl._mouseOn) {
            fieldControl.MouseOff ()
            fieldControl._mixingTime = 0
            let temp = []
            for (let i = 0; i < Global.blocks.length; i++) {
                for (let j = 0; j < Global.blocks[i].length; j++) {
                    temp.push(Global.blocks[i][j])
                }
            }

            temp = shuffle(temp)
            let count = 0
            for (let i = 0; i < Global.blocks.length; i++) {
                for (let j = 0; j < Global.blocks[i].length; j++) {
                    Global.blocks[i][j] = temp[count]
                    const block = temp[count]
                    const blockController = block.getComponent('BlockController')
                    block.zIndex = j               
                    blockController._line = j 
                    blockController._column = i
                    count ++
                }
            }
            fieldControl.MoveBlocks(temp)
        }

        function shuffle(arr){
            let j, temp;
            for(let i = arr.length - 1; i > 0; i--){
                j = Math.floor(Math.random()*(i + 1));
                temp = arr[j];
                arr[j] = arr[i];
                arr[i] = temp;
            }
            return arr;
        }
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
