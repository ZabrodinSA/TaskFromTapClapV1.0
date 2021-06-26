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
        sizeScale: {
            type: cc.Float,
            default: 0.1
        }, 
        gameControllerNode: {
            type: cc.Node,
            default:  undefined
        }, 
        block: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // start () {},

    // update (dt) {},

    FieldRender () {
        this.node.setScale(cc.Vec2(this.sizeScale * game.field.numberOfColumns, this.sizeScale * game.field.numberOfLines))
        this.BlocksRender()
    },

    BlocksRender () {
        cc.log('blocks render')
        const blockControllers = this.GetAllBlockControllers()
        for (var i = 0; i < blockControllers.length; i++) {
            blockControllers[i].MoveBlock()
        }
        this.CreatingBlocks ()
    },

    CreatingBlocks () {
        const blockControllers = this.GetAllBlockControllers()
        const self = this
        let temp = []
        let actions = []
        const delay = cc.delayTime(this.block.data.getComponent('BlockController').blockSpawnTime)
        game.field.ExecuteForAllBlocks((blocks, column, line) => {
            let blockRendered = false
            for (var i = 0; i < blockControllers.length; i++) {
                if (blockControllers[i].blockModel == blocks[column][line]) {
                    blockRendered = true
                }
            }
            if (!blockRendered) {
                const callFunc = cc.callFunc(() => {
                    this.CreatingBlock(game.field.blocks[column][line])
                })
                temp.push({callFunc, line})
            }
        })

        for (var i = 0; i < game.field.numberOfLines; i++) {
            let flag = false
            for (var j = 0; j < temp.length; j++) {
                if (temp[j].line == i) {
                    actions.push(temp[j].callFunc)
                    flag = true
                }
            }
            if (flag) {
                actions.push(delay)
            }
        }

        const callFuncMouseOn = cc.callFunc(() => {
            self.MouseOn()
        })

        if (actions.length == 0) {
            cc.log(this._mixingTime)
            actions.push(cc.delayTime(this._mixingTime))
            actions.push(callFuncMouseOn)
        } else {
            actions.push(callFuncMouseOn) 
        }
        const seq = cc.sequence(actions)
        this.node.runAction(seq)
    },

    CreatingBlock (blockModel) {
        const block = cc.instantiate(this.block)
        block.getComponent('BlockController').blockModel = blockModel
        this.node.addChild(block, blockModel.line, 'Block')
    },

    RenderSelectedBlocks () { 
        const blockControllers = this.GetAllBlockControllers()
        for (var i = 0; i < blockControllers.length; i++) {
            if (blockControllers[i].blockModel.selected) {
                blockControllers[i].RenderSelectedBlock ()
            }
        }
    },

    RenderAnUnselectedBlocks () {
        const blockControllers = this.GetAllBlockControllers()
        for (var i = 0; i < blockControllers.length; i++) {
            if (!blockControllers[i].blockModel.selected) {
                blockControllers[i].RenderAnUnselectedBlock ()
            }
        }
    },
        
    ClickHandler (column, line) {
        if (game.ClickHandler(column, line) > 0) {
            this.gameControllerNode.getComponent('GameController').RenderGame()
            this.MouseOff()
            this.BlocksDestructionRendering()
        }
    },

    BlocksDestructionRendering () {
        const blockControllers = this.GetAllBlockControllers()
        let self  = this
        let actions = []
        for (var i = 0; i < blockControllers.length; i++) {
            if (blockControllers[i].blockModel.selected) {
                const blockController = blockControllers[i]
                const callFunc = cc.callFunc (() => {
                    blockController.BlockDestructionRendering ()
                })
                actions.push(callFunc)
            }
        }
        const delay = cc.delayTime(this.block.data.getComponent('BlockController').destructionTime )
        actions.push(delay)
        const callFuncBlocksRender = cc.callFunc(() => {
            self.BlocksRender()
        })
        actions.push(callFuncBlocksRender)

        const seq = cc.sequence (actions)
        this.node.runAction (seq)
    },

    GetAllBlockControllers () {
        let blockControllers = []
        for (var i = 0; i < this.node.children.length; i++) {
            if (this.node.children[i].name == 'Block') {
                blockControllers.push(this.node.children[i].getComponent('BlockController'))
            }
        }
        return blockControllers
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
