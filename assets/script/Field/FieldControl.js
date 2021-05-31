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
        mixingTime: {
            type: cc.Float,
            default: 1.5
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

    // onLoad () {},

    // start () {},

    // update (dt) {},
    
    ClickHandler () {
        const gameController = this.gameControllerNode.getComponent('GameController')
        gameController.ClickHandler()
        cc.log('handlerField')
    },

    CheckingTheNumberOfBlocks () {
        const fieldControl = this
        fieldControl.MouseOff ()

        const blockRenderer = this.block.data.getComponent('BlockRenderer')
        let actions = []
        const delaySpaw = cc.delayTime (blockRenderer.blockSpawnTime)
        const delayMove = cc.delayTime (blockRenderer.blockMovementTime)   
        
        for (let j = 0; j < Global.height; j++) {
            for (let i = 0; i < Global.width; i++) {
                if (Global.blocks[i].length < Global.height) {
                    const callFuncCreate = cc.callFunc (function () {
                        fieldControl.CreatingBlock(i, j)
                    })
                    actions.push(callFuncCreate)
                }
            }
            if (j == Global.height - 1) {
                const callFuncMouseOn = cc.callFunc (function () {
                    fieldControl.MouseOn ()
                })
                actions.push(delaySpaw)
                actions.push(callFuncMouseOn)
            } else {
                actions.push(delaySpaw)
                actions.push(delayMove)
            }
        }

        const seq = cc.sequence (actions)
        this.node.runAction (seq)
    },

    CreatingBlock (column, line, isSuper = false) {
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
        blockController._superBlock = isSuper
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
    },

    MouseOff () {
        this._mouseOn = false
    }

});
