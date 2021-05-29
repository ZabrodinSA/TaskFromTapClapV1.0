cc.Class({
    extends: cc.Component,

    properties: {
        blocksAtlas: {
            type: cc.SpriteAtlas,
            default: null
        },

        blockOmitted: {
            type: Boolean,
            default: false
        },
        colorBlock: {
            type: String, 
            default: null           
        },
        blockSpawnTime: {
            type: cc.Float,
            default: 1
        },
        blockMovementTime: {
            type: cc.Float,
            default: 0.3
        },
        blockDestructionTime: {
            type: cc.Float,
            default: 0.7
        },
        scaleOmittedX: {
            type: cc.Float,
            default: 1
        },
        scaleOmittedY: {
            type: cc.Float,
            default: 1
        },
        scaleNotOmittedX: {
            type: cc.Float,
            default: 1
        },
        scaleNotOmittedY: {
            type: cc.Float,
            default: 1
        },
        sizeScale: {
            type: cc.Float,
            default: 0.9
        }, 
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        const sprite = this.node.getComponent(cc.Sprite)
        const spriteFrames = this.blocksAtlas.getSpriteFrames()
        sprite.spriteFrame = spriteFrames[cc.math.randomRangeInt(0, spriteFrames.length)]
        this.colorBlock = sprite.spriteFrame.name

        this.scaleOmittedX = 1 / this.node.parent.scaleX * this.sizeScale
        this.scaleOmittedY = 1 / this.node.parent.scaleY * this.sizeScale
        this.scaleNotOmittedX = 1 / this.node.parent.scaleX 
        this.scaleNotOmittedY = 1 / this.node.parent.scaleY 
        this.node.setScale(0, 0)
        const action = cc.scaleTo(this.blockSpawnTime, this.scaleNotOmittedX, this.scaleNotOmittedY)
        const callFunc = cc.callFunc(function () {this.OnMouse ()}, this)
        const seq = cc.sequence(action, callFunc)
        this.node.runAction(seq)
    },

    // start () {},

    // updete (dt) {},

    OnMouse () { 
        this.node.on('mouseenter', () => {
            this.EnterToBlock()
        })
        this.node.on('mouseleave', () => {
            this.LeaveToBlock()
        })
        this.node.on('mousedown', () => {
            cc.find('/Canvas/GameController').getComponent('BlocksController').ClickHandler()
        })
    },

    OffMouse () {
        this.node.off('mouseenter')
        this.node.off('mouseleave')
        this.node.off('mousedown')
    },
    
    EnterToBlock () {
        this.blockOmitted = true
        this.node.setScale(cc.v2(this.scaleOmittedX, this.scaleOmittedY))
        const adjacentBlocks = [this.RaysFromTheBlock(this.node, 'Up'),
                              this.RaysFromTheBlock(this.node, 'Down'),
                              this.RaysFromTheBlock(this.node, 'Left'),
                              this.RaysFromTheBlock(this.node, 'Right')]
        for (var i = 0; i < adjacentBlocks.length; i++) {
            if (adjacentBlocks[i].length != 0 ) {
                const resultBlock = adjacentBlocks[i][0].collider.node
                const spriteFrame = resultBlock.getComponent(cc.Sprite).spriteFrame
                const resultBlockController = resultBlock.getComponent('BlockController')
                if (!resultBlockController.blockOmitted && this.colorBlock == spriteFrame.name)
                resultBlockController.EnterToBlock()
            }
        }
    },

    LeaveToBlock () {
        this.blockOmitted = false
        this.node.setScale(cc.v2(this.scaleNotOmittedX, this.scaleNotOmittedY))
        const nodes = cc.find('/Canvas/GameController').getComponent('BlocksController').FindAllBlocks ()
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].getComponent('BlockController').blockOmitted) {
                nodes[i].getComponent('BlockController').LeaveToBlock ()
            }
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
