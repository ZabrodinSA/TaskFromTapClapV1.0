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
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var sprite = this.node.getComponent(cc.Sprite)
        const spriteFrames = this.blocksAtlas.getSpriteFrames()
        sprite.spriteFrame = spriteFrames[cc.math.randomRangeInt(0, spriteFrames.length)]
        this.colorBlock = sprite.spriteFrame.name

        this.node.setScale(0, 0)
        var action = cc.scaleTo(this.blockSpawnTime, 1 / this.node.parent.scaleX, 1 / this.node.parent.scaleY)
        var callFunc = cc.callFunc(this.OnMouse, this)
        var seq = cc.sequence(action, callFunc)
        this.node.runAction(seq)
    },

    start () {},

    // update (dt) {},

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
        this.node.setScale(cc.v2(0.9 * this.node.scaleX, 0.9 * this.node.scaleY))
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
        this.node.setScale(cc.v2(this.node.scaleX / 0.9, this.node.scaleY / 0.9))
        var nodes = cc.find('/Canvas/GameController').getComponent('BlocksController').FindAllBlocks ()
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].getComponent('BlockController').blockOmitted) {
                nodes[i].getComponent('BlockController').LeaveToBlock ()
            }
        }

    },

    MoveTheBlockDown () {
        // var blocks = []
        // var actions = []
        // blocks.push(this.node)
        // const distance = this.node.getComponent(cc.PhysicsBoxCollider).size.height / this.node.parent.scaleY
        // const floor = this.node.getComponent(cc.PhysicsBoxCollider).size.height / this.node.parent.scaleY / 2
        //             - this.node.parent.height / 2 + 5
        // var delay = 0
        // var count = 0
        // var pStart = this.node.parent.convertToWorldSpaceAR(new cc.Vec2(
        //     this.node.x, this.node.y), pStart)
        // var pDown = this.node.parent.convertToWorldSpaceAR(new cc.Vec2(
        //     this.node.x, this.node.y - this.node.parent.height / this.node.parent.scaleY), pDown)   
        // var result = cc.director.getPhysicsManager().rayCast (pStart, pDown, cc.RayCastType.All)   
        // move (this.node)
        // count ++
        // // for (var i = 0; i < result.length; i++) {
        // result = this.node.getComponent('BlockController').RaysFromTheBlock(this.node, 'Down')
        // if (result.length == 0 && this.node.y > floor) {
        //     count ++
        //     this.scheduleOnce (function () {
        //             move (this.node)                
        //     }, this.node.getComponent('BlockController').blockMovementTime * (0 + 1))
        // }
        // return delay = this.node.getComponent('BlockController').blockMovementTime * count

        // }
       


        // for (result)
        // while (result.length == 0 && this.node.y > floor) {
        //         this.node.setPosition (this.node.x, this.node.y - distance)
        //         result = this.RaysFromTheBlock(this.node, 'Down')   
        //         count ++        
        //         cc.log(count)
        // } 
        // this.node.setPosition (this.node.x, this.node.y + distance * count)

        // if (count != 0) {
        // var    result2 = this.RaysFromTheBlock(this.node, 'Up')  
        // //     cc.log('до второго цикла')
        //     while (result2.length != 0) {
        //         blocks.push(result2[0].collider.node)
        //         result2 = blocks[blocks.length - 1].getComponent('BlockController').RaysFromTheBlock(this.node, 'Up') 
        //     }
        //     cc.log(blocks.length)


        //     for (var i = 0; i < blocks.length; i++) {
            function move (block) {
                // var newPoint = new cc.Vec2 (block.x, block.y - distance)
                var action = cc.moveTo(block.getComponent('BlockController').blockMovementTime, newPoint)
                block.runAction(action)
                block.zIndex --
                result = block.getComponent('BlockController').RaysFromTheBlock(block, 'Up')
                if (result.length != 0) {
                    move (result[0].collider.node)
                } 
            }
        //     }  
        // }   

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
