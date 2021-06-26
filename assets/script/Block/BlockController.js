const { Block } = require("../BlockClasses");

cc.Class({
    extends: cc.Component,

    properties: {
        _blockOmitted: {
            type: Boolean,
            default: false
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
        blockModel: {
            type: Block,
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
        sizeScale: {
            type: cc.Float,
            default: 0.9
        },

        // blocksController: {
        //     type: cc.Node,
        //     default:  undefined
        // },  
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.SetSpriteFrame()
        const field = this.node.parent

        this._scaleOmittedX = 1 / field.scaleX * this.sizeScale
        this._scaleOmittedY = 1 / field.scaleY * this.sizeScale
        this._scaleNotOmittedX = 1 / field.scaleX 
        this._scaleNotOmittedY = 1 / field.scaleY 

        this._column = this.blockModel.column
        if (this.blockModel.name == 'super') {
            this.RenderForSuper ()
        } else {
            this.RenderForColor ()
        }
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

    RenderForSuper () {
        this._line = this.blockModel.line
        this.SetPosition(this._column, this._line)
        this.RenderingCreation ()
    },

    RenderForColor () {
        this._line = game.field.numberOfLines - 1
        this.SetPosition(this._column, this._line)
        this.RenderingCreation ()
    },

    RenderingCreation () {
        const self = this
        const block = this.node
        block.setScale(0, 0)
        const action = cc.scaleTo(this.blockSpawnTime, this._scaleNotOmittedX, this._scaleNotOmittedY)
        const callFuncMove = cc.callFunc( function () {              
            self.MoveBlock()
        })
        const seq = cc.sequence(action, callFuncMove)
        this.node.runAction(seq)
    },

    SetPosition (column, line) {
        const block = this.node
        const field = this.node.parent

        const sizeCollliderBlock = block.getComponent(cc.PhysicsBoxCollider).size
        const _x = (column + 0.5) * block.width / field.scaleX - field.width / 2    
        const _y = (line + 0.5) * sizeCollliderBlock.height / field.scaleY - field.height / 2       
        this.node.setPosition(_x, _y)
    },

    SetSpriteFrame () {
        let self = this

        cc.loader.loadRes('Blocks/' + this.blockModel.name, cc.SpriteFrame, function (err, sprite) {
            self.node.getComponent(cc.Sprite).spriteFrame = sprite;
        })           
    },

    MoveBlock () {
        const self = this
        const block = this.node
        const field = block.parent
        const fieldControl = field.getComponent ('FieldControl')
        const sizeCollliderBlock = block.getComponent(cc.PhysicsBoxCollider).size

        const _x = (this.blockModel.column + 0.5) * block.width / field.scaleX - field.width / 2   //координата х для позиции блока
        const _y = (this.blockModel.line + 0.5) * sizeCollliderBlock.height / field.scaleY - field.height / 2   //координата y для позиции блока

        const distanceInLines =  Math.abs((block.y - _y)/(sizeCollliderBlock.height / field.scaleY))
        const moveTime = this.blockMovementTime * distanceInLines
        const action = cc.moveTo(moveTime, _x, _y)
        const callFunc = cc.callFunc (() => {
            self._column = self.blockModel.column
            self._line = self.blockModel.line
            block.zIndex = self.blockModel.line
        })

        if (fieldControl._mixingTime < moveTime) {
            fieldControl._mixingTime = moveTime
        }
        cc.log(fieldControl._mixingTime)
        const seq = cc.sequence(action, callFunc)
        block.runAction(seq)
    },
    
    EnterToBlock () {
        const fieldControl = this.node.parent.getComponent('FieldControl')
        if (fieldControl._mouseOn) {
            game.field.SelectTheBlock(this._column, this._line)
            fieldControl.RenderSelectedBlocks ()
        }
    },

    LeaveToBlock () {       
        const fieldControl = this.node.parent.getComponent('FieldControl')
        if (fieldControl._mouseOn) {
            game.field.DoNotSelectAllBlocks()
            fieldControl.RenderAnUnselectedBlocks ()
        }
    },

    RenderSelectedBlock () {
        this.node.setScale(this._scaleOmittedX, this._scaleOmittedY)
    },

    RenderAnUnselectedBlock () {
        this.node.setScale(this._scaleNotOmittedX, this._scaleNotOmittedY)
    },

    BlockDestructionRendering () {
        const blockNode = this.node
        const action = cc.scaleTo(this.destructionTime, 0, 0)
        const callFuncDestroy = cc.callFunc(function () {
            blockNode.destroy() 
        })
        const seq = cc.sequence (action, callFuncDestroy)
        blockNode.runAction(seq)
    },

    ClickHandler () {
        const fieldControl = this.node.parent.getComponent('FieldControl')

        if (fieldControl._mouseOn) {
            fieldControl.ClickHandler (this._column, this._line)
        }
    },
});
