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
        scaleOmitted: {
            type: cc.Float,
            default: 1
        },
        scaleNotOmitted: {
            type: cc.Float,
            default: 1
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var sprite = this.node.getComponent(cc.Sprite)
        const spriteFrames = this.blocksAtlas.getSpriteFrames()
        sprite.spriteFrame = spriteFrames[cc.math.randomRangeInt(0, spriteFrames.length)]
        this.colorBlock = sprite.spriteFrame.name

        this.scaleOmitted = 1 / this.node.parent.scaleX * 0.9
        this.scaleNotOmitted = 1 / this.node.parent.scaleX 
        this.node.setScale(0, 0)
        var action = cc.scaleTo(this.blockSpawnTime, 1 / this.node.parent.scaleX, 1 / this.node.parent.scaleY)
        var callFunc = cc.callFunc(this.OnMouse, this)
        var seq = cc.sequence(action, callFunc)
        this.node.runAction(seq)
    },

    start () {},

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
        this.node.setScale(cc.v2(this.scaleOmitted, this.scaleOmitted))
        var adjacentBlocks = [this.RaysFromTheBlock(this.node, 'Up'),
                              this.RaysFromTheBlock(this.node, 'Down'),
                              this.RaysFromTheBlock(this.node, 'Left'),
                              this.RaysFromTheBlock(this.node, 'Right')]
        for (var i = 0; i < adjacentBlocks.length; i++) {
            if (adjacentBlocks[i].length != 0 ) {
                var resultBlock = adjacentBlocks[i][0].collider.node
                var spriteFrame = resultBlock.getComponent(cc.Sprite).spriteFrame
                var resultBlockController = resultBlock.getComponent('BlockController')
                if (!resultBlockController.blockOmitted && this.colorBlock == spriteFrame.name)
                resultBlockController.EnterToBlock()
            }
        }
    },

    LeaveToBlock () {
        this.blockOmitted = false
        this.node.setScale(cc.v2(this.scaleNotOmitted, this.scaleNotOmitted))
        var nodes = cc.find('/Canvas/GameController').getComponent('BlocksController').FindAllBlocks ()
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].getComponent('BlockController').blockOmitted) {
                nodes[i].getComponent('BlockController').LeaveToBlock ()
            }
        }

    },

    RaysFromTheBlock (block, direction) {
        var pStart = block.parent.convertToWorldSpaceAR(new cc.Vec2(
            block.x, block.y), pStart)
        if (direction == 'Up') {
            var pUp = block.parent.convertToWorldSpaceAR(new cc.Vec2(
                block.x, block.y + block.height / block.parent.scaleY), pUp)
            var result = cc.director.getPhysicsManager().rayCast (pStart, pUp, cc.RayCastType.Closest)
        } else if (direction == 'Down') {
            var pDown = block.parent.convertToWorldSpaceAR(new cc.Vec2(
                block.x, block.y - block.height / block.parent.scaleY), pDown)
            var result = cc.director.getPhysicsManager().rayCast (pStart, pDown, cc.RayCastType.Closest)    
        } else if (direction == 'Right') {
            var pRight = block.parent.convertToWorldSpaceAR(new cc.Vec2(
                block.x + block.width / block.parent.scaleX, block.y), pRight)
            var result = cc.director.getPhysicsManager().rayCast (pStart, pRight, cc.RayCastType.Closest)
        } else if (direction == 'Left') {
            var pLeft = block.parent.convertToWorldSpaceAR(new cc.Vec2(
                block.x - block.width / block.parent.scaleX, block.y), pLeft)
            var result = cc.director.getPhysicsManager().rayCast (pStart, pLeft, cc.RayCastType.Closest)
        }
        return result
    },
});
