cc.Class({
    extends: cc.Component,

    properties: {
        _blockOmitted: {
            type: Boolean,
            default: false
        },
        _color: {
            type: String, 
            default: null           
        },
        _scaleOmittedX: {
            type: cc.Float,
            default: 1
        },
        _scaleOmittedY: {
            type: cc.Float,
            default: 1
        },
        _scaleNotOmittedX: {
            type: cc.Float,
            default: 1
        },
        _scaleNotOmittedY: {
            type: cc.Float,
            default: 1
        },
        _line: {
            type: cc.Integer,
        },
        _column: {
            type: cc.Integer,
        },
        _superBlock: {
            type: Boolean,
            default: false
        },
        sizeScale: {
            type: cc.Float,
            default: 0.9
        }, 
        blocksController: {
            type: cc.Node,
            default:  undefined
        },  
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        const field = this.node.parent
        const blockCreator = this.node.getComponent('BlockRenderer')

        this._scaleOmittedX = 1 / field.scaleX * this.sizeScale
        this._scaleOmittedY = 1 / field.scaleY * this.sizeScale
        this._scaleNotOmittedX = 1 / field.scaleX 
        this._scaleNotOmittedY = 1 / field.scaleY 

        blockCreator.CreateBlock()
        this._color = this.node.getComponent(cc.Sprite).spriteFrame.name
    },

    start () {   
        this.node.on('mouseenter', () => {
            this.EnterToBlock()
        })
        this.node.on('mouseleave', () => {
            this.LeaveToBlock()
        })
        this.node.on('mousedown', () => {
            this.ClickHandler()
        })
    },

    // updete (dt) {},
    
    EnterToBlock () {
        const blocksController = this.node.parent.getComponent('BlocksController')

        if (blocksController._mouseOn) {
            this._blockOmitted = true
            Global.blocks[this._column][this._line].omitted = true
            this.node.setScale(cc.v2(this._scaleOmittedX, this._scaleOmittedY))
            const adjacentBlocks = [this.RaysFromTheBlock(this.node, 'Up'),
                                this.RaysFromTheBlock(this.node, 'Down'),
                                this.RaysFromTheBlock(this.node, 'Left'),
                                this.RaysFromTheBlock(this.node, 'Right')]

            for (let i = 0; i < adjacentBlocks.length; i++) {
                if (adjacentBlocks[i].length != 0 ) {
                    const resultBlock = adjacentBlocks[i][0].collider.node
                    const spriteFrame = resultBlock.getComponent(cc.Sprite).spriteFrame
                    const resultBlockController = resultBlock.getComponent('BlockController')

                    if (!resultBlockController._blockOmitted && this._color == spriteFrame.name) {
                        resultBlockController.EnterToBlock()
                    }
                }
            }
        }
    },

    LeaveToBlock () {
        const blocksController = this.node.parent.getComponent('BlocksController')

        if (blocksController._mouseOn) {
            this._blockOmitted = false
            this.node.setScale(cc.v2(this._scaleNotOmittedX, this._scaleNotOmittedY))

            for (let i = 0; i < Global.blocks.length; i++) {
                for (let j = 0; j < Global.blocks[i].length; j++) {
                    const blockController = Global.blocks[i][j].getComponent('BlockController')
                    if (blockController._blockOmitted) {
                        blockController.LeaveToBlock()
                    }
                }
            }
        }
    },

    ClickHandler () {
        const blocksController = this.node.parent.getComponent('BlocksController')

        if (blocksController._mouseOn) {
            blocksController.ClickHandler ()
        }
    },

    RaysFromTheBlock (block, direction) {
        const pStart = block.parent.convertToWorldSpaceAR(new cc.Vec2(
            block.x, block.y), pStart)
        let result
        if (direction == 'Up') {
            const pUp = block.parent.convertToWorldSpaceAR(new cc.Vec2(
                block.x, block.y + block.height / block.parent.scaleY), pUp)
            result = cc.director.getPhysicsManager().rayCast (pStart, pUp, cc.RayCastType.Closest)
        } else if (direction == 'Down') {
            const pDown = block.parent.convertToWorldSpaceAR(new cc.Vec2(
                block.x, block.y - block.height / block.parent.scaleY), pDown)
            result = cc.director.getPhysicsManager().rayCast (pStart, pDown, cc.RayCastType.Closest)    
        } else if (direction == 'Right') {
            const pRight = block.parent.convertToWorldSpaceAR(new cc.Vec2(
                block.x + block.width / block.parent.scaleX, block.y), pRight)
            result = cc.director.getPhysicsManager().rayCast (pStart, pRight, cc.RayCastType.Closest)
        } else if (direction == 'Left') {
            const pLeft = block.parent.convertToWorldSpaceAR(new cc.Vec2(
                block.x - block.width / block.parent.scaleX, block.y), pLeft)
            result = cc.director.getPhysicsManager().rayCast (pStart, pLeft, cc.RayCastType.Closest)
        }

        return result
    },
});
