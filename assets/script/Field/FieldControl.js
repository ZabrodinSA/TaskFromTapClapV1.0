cc.Class({
    extends: cc.Component,

    properties: {
        _numberOfCollums: {
            type: cc.Integer,
            default: 10
        },
        _numberOfLines: {
            type: cc.Integer,
            default: 10
        },
        _mouseOn: {
            type: Boolean,
            default: false
        },        
        _mixingTime: {
            type: cc.Float,
            default: 0
        },
        numberOfPossibleMovesTextNode: {
            type: cc.Node,
            default:  undefined
        },   
        gameControllerNode: {
            type: cc.Node,
            default:  undefined
        },  
        numberOfPossibleMovesTextNode: {
            type: cc.Node,
            default:  undefined
        },     
        block: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._numberOfCollums = Global.width
        this._numberOfLines = Global.height
    },

    // start () {},

    // update (dt) {},
    
    ClickHandler (column, line, isSuperBlock) {
        const gameController = this.gameControllerNode.getComponent('GameController')
        gameController.ClickHandler(column, line, isSuperBlock)
    },

    DestroyBlocks (omittedBlocks, notOmittedBlocks) {
        const fieldControl = this
        fieldControl.MouseOff ()

        let actions = []
        const blockRenderer = this.block.data.getComponent('BlockRenderer')
        const delayDestruction = cc.delayTime (blockRenderer.destructionTime)

        for (let i = 0; i < omittedBlocks.length; i++) {                            
            const _blockRenderer = omittedBlocks[i].getComponent('BlockRenderer')
            const callFuncDestroy = cc.callFunc(function () {
                _blockRenderer.DestroyBlock ()
            }) 
            actions.push(callFuncDestroy)
        }
        actions.push(delayDestruction)

        const callFuncMove = cc.callFunc (function () {
            fieldControl.MoveBlocks (notOmittedBlocks)
        })
        actions.push(callFuncMove)

        const seq = cc.sequence (actions)
        this.node.runAction (seq)
    },

    MoveBlocks (notOmittedBlocks) {
        const fieldControl = this
        const blockRenderer = this.block.data.getComponent('BlockRenderer')
        const delayMove = cc.delayTime (blockRenderer.blockMovementTime)
        let actions = []

        for (let i = 0; i < notOmittedBlocks.length; i++) {
            const _blockRenderer = notOmittedBlocks[i].getComponent('BlockRenderer')
            const callFuncMove = cc.callFunc(function () {
                _blockRenderer.MoveBlock ()
            }) 
            actions.push(callFuncMove)
        }
        actions.push(delayMove)

        const callFuncChek = cc.callFunc(function () {
            fieldControl.CheckingTheNumberOfBlocks ()
        })
        actions.push(callFuncChek)

        const seq = cc.sequence (actions)
        this.node.runAction (seq)
    },

    CheckingTheNumberOfBlocks () {
        const fieldControl = this
        fieldControl.MouseOff () 
        const blockRenderer = this.block.data.getComponent('BlockRenderer')
        let actions = []
        let delaySpaw = cc.delayTime (blockRenderer.blockSpawnTime)
        let delayMove = cc.delayTime (blockRenderer.blockMovementTime)  

        for (let j = 0 ; j < Global.height; j++) {
            let noBlock = false
            for (let i = 0; i < Global.width; i++) {
                if (Global.blocks[i][j] == undefined) {
                    noBlock = true
                    const callFuncCreate = cc.callFunc (function () {
    
                        fieldControl.CreatingBlock(i, j)
                    })
                    actions.push(callFuncCreate)   
                }             
            }

            if (noBlock) {
                actions.push(delaySpaw)
                actions.push(delayMove)              
            }

            if (j == Global.height - 1) {
                actions.pop()
                const callFuncMouseOn = cc.callFunc (function () {
                    fieldControl.CheckingNumberOfMoves ()
                    fieldControl.MouseOn ()
                })
                actions.push(callFuncMouseOn)
            } 
        }

        if (actions.length == 1) {
            const delay = cc.delayTime (this._mixingTime) 
            const seq = cc.sequence (delay, actions[0])
            this.node.runAction (seq)
        } else {
            const seq = cc.sequence (actions)
            this.node.runAction (seq)
        }
    },

    CheckingNumberOfMoves () {
        const gameController = this.gameControllerNode.getComponent('GameController')
        let _numberOfMoves = 0
        let _numberOfSuperBlocks = 0
        for (let i = 0; i < Global.blocks.length; i++) {
            for (let j = 0; j < Global.blocks[i].length; j++) {
                const _blockController = Global.blocks[i][j].getComponent('BlockController')
                if (!_blockController.blockOmitted) {
                    const countBefore = this.CountOmittedBlocks ()
                    _blockController.EnterToBlock (true)
                    const countAfter = this.CountOmittedBlocks ()
                    if (countAfter - countBefore >= gameController.K) {
                        _numberOfMoves ++
                    } 
                } 
                if (_blockController._superBlock) {
                    _numberOfSuperBlocks++
                } 
            }
        }

        const blocksController = Global.blocks[0][0].getComponent('BlockController')
        blocksController.LeaveToBlock (true) 
        _numberOfMoves += _numberOfSuperBlocks

        if (gameController._numberOfStirring == 0 && _numberOfMoves == 0) {
            gameController.EndGame () 
        }

        const numberOfPossibleMovesText = this.numberOfPossibleMovesTextNode.getComponent(cc.Label)
        numberOfPossibleMovesText.string = 'Доступно\n' + _numberOfMoves
    },

    CountOmittedBlocks () {
        let count = 0

        for (let i = 0; i < Global.blocks.length; i++) {
            for (let j = 0; j < Global.blocks[i].length; j++) {
                const blocksController = Global.blocks[i][j].getComponent('BlockController')

                if (blocksController._blockOmitted) {

                    count ++ 
                }
            }
        }
        
        return count           
    },

    CreatingBlock (column, line) {
        const block = cc.instantiate(this.block)
        this.node.addChild(block, line, 'Block')

        const blockController = block.getComponent('BlockController')
        const blockRenderer = block.getComponent('BlockRenderer')
        const sizeCollliderBlock = block.getComponent(cc.PhysicsBoxCollider).size
        const _x = (column + 0.5) * block.width / this.node.scaleX - this.node.width / 2    //координата х для создания блока в нужном стобце
        const _y = (Global.height - 0.5)*sizeCollliderBlock.height / this.node.scaleY - this.node.height / 2    //координата y для создания блока в верхней строке
        
        block.setPosition(_x, _y)
        blockController._column = column
        blockController._line = line
        blockController._superBlock = false
        Global.blocks[column][line] = block

        const callFuncMove = cc.callFunc( function () {              
            blockRenderer.MoveBlock()
        })
        const delaySpaw = cc.delayTime (blockRenderer.blockSpawnTime)
        const seq = cc.sequence(delaySpaw, callFuncMove)
        this.node.runAction(seq)
    },

    MouseOn () {
        this._mouseOn = true
        cc.log('On')
    },

    MouseOff () {
        this._mouseOn = false
        cc.log('Off')

    }

});
