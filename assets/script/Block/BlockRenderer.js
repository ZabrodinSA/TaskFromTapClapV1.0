cc.Class({
    extends: cc.Component,

    properties: {
        blocksAtlas: {
            type: cc.SpriteAtlas,
            default: null
        },
        spriteSuperBlock: {
            type: cc.SpriteFrame,
            default: null
        },
        blockSpawnTime: {
            type: cc.Float,
            default: 0.5
        },
        blockMovementTime: {
            type: cc.Float,
            default: 0.3
        },
        destructionTime: {
            type: cc.Float,
            default: 0.5
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // start () {},

    // update (dt) {},

    CreateBlock () {
        const blockController = this.node.getComponent('BlockController')

        const sprite = this.node.getComponent(cc.Sprite)
        const spriteFrames = this.blocksAtlas.getSpriteFrames()
        sprite.spriteFrame = spriteFrames[cc.math.randomRangeInt(0, spriteFrames.length)]

        this.node.setScale(0, 0)
        const action = cc.scaleTo(this.blockSpawnTime, blockController._scaleNotOmittedX, blockController._scaleNotOmittedY)
        this.node.runAction(action)
    },

    MoveBlock () {
        const block = this.node
        const field = block.parent
        const fieldControl = field.getComponent ('FieldControl')
        const blockController = block.getComponent('BlockController')
        const sizeCollliderBlock = block.getComponent(cc.PhysicsBoxCollider).size
        const _x = (blockController._column + 0.5) * block.width / field.scaleX - field.width / 2   //координата х для позиции блока
        const _y = (blockController._line + 0.5) * sizeCollliderBlock.height / field.scaleY - field.height / 2   //координата y для позиции блока


        const distanceInLines =  Math.abs((block.y - _y)/(sizeCollliderBlock.height / field.scaleY))
        const action = cc.moveTo(this.blockMovementTime * distanceInLines, _x, _y)
        block.runAction(action)

        if (fieldControl._mixingTime < this.blockMovementTime * distanceInLines) {
            fieldControl._mixingTime = this.blockMovementTime * distanceInLines
        }
    },

    DestroyBlock () {
        const blockNode = this.node
        const action = cc.scaleTo(this.destructionTime, 0, 0)
        const callFuncDestroy = cc.callFunc(function () {
            blockNode.destroy() 
        })
        const seq = cc.sequence (action, callFuncDestroy)
        blockNode.runAction(seq)
    },

    SetSuperBlock () {
        const sprite = this.node.getComponent(cc.Sprite)
        sprite.spriteFrame = this.spriteSuperBlock 
        
        
    }
});
