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
        sizeScale: {
            type: cc.Float,
            default: 0.1
        },
        numberOfPossibleMovesTextNode: {
            type: cc.Node,
            default:  undefined
        },   
        gameControllerNode: {
            type: cc.Node,
            default:  undefined
        },      
        block: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // this._numberOfCollums = Global.width
        // this._numberOfLines = Global.height
    },

    start () {
        this.SetSizeField ()

        this.CheckingTheNumberOfBlocks()
    },

    // update (dt) {},

    SetSizeField () {        
        this.node.setScale(cc.Vec2(this.sizeScale * Global.width, this.sizeScale * Global.height))
    },

    CheckingTheNumberOfBlocks () {
        const blocksController = this.node.getComponent('BlocksController')
        blocksController.MouseOff ()
        const fieldControl = this
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
                    blocksController.MouseOn ()
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

        // for (let columnNumber = 0; columnNumber < this._numberOfCollums; columnNumber++){
        //     const _x = (columnNumber + 0.5) * this.block.data.width / this.node.scaleX - this.node.width / 2 // координата х середины каждого столбца 
        //     const _y = this.node.height / 1.5                                                                // координата y ниже первой строки 
        //     const p1 = this.node.convertToWorldSpaceAR (new cc.Vec2(_x, -_y), p1)
        //     const p2 = this.node.convertToWorldSpaceAR (new cc.Vec2(_x, _y), p2)
        //     const results = cc.director.getPhysicsManager().rayCast (p1, p2, cc.RayCastType.All)
            
        //     if (results.length < this._numberOfLines) {
        //         this.CreatingBlocks (columnNumber, this._numberOfLines - results.length)
        //     }
        // }
        // let numberOfPossibleMoves = this.numberOfPossibleMovesTextNode
        // const gameController = this.gameControllerNode.getComponent('BlocksController')
        // const callFunc = cc.callFunc(function () {
        //     numberOfPossibleMoves.getComponent(cc.Label).string = 'Доступно\n' + gameController.NumberOfMoves()})
        // const delay = cc.delayTime(this.block.data.getComponent('BlockController').blockSpawnTime)
        // const seq = cc.sequence(delay, callFunc)
        // this.node.runAction(seq)
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
            // Global.blocks[column][line] = {
            //     color: null,
            //     superBlock: isSuper,
            //     omitted: false,
            // }
            Global.blocks[column][line] = block

            const callFuncMove = cc.callFunc( function () {              
                blockRenderer.MoveBlock()
            })
            const delaySpaw = cc.delayTime (blockRenderer.blockSpawnTime)
            const seq = cc.sequence(delaySpaw, callFuncMove)
            this.node.runAction(seq)


        

    //     const sizeCollliderBlock = this.block.data.getComponent(cc.PhysicsBoxCollider).size
    //     const _x = (columnNumber + 0.5) * this.block.data.width / this.node.scaleX - this.node.width / 2    //координата х для создания блока 
    //     let _y = (this._numberOfLines - 0.5)*sizeCollliderBlock.height / this.node.scaleY - this.node.height / 2    //координата y для создания блока 
    //     for (let i = 0; i < numberOfBlocks; i++){
    //        const block = cc.instantiate(this.block)
    //        block.setPosition(_x, _y) 
    //        this.node.addChild(block, this._numberOfLines - i, `Block`)
    //        _y = _y - sizeCollliderBlock.height / this.node.scaleY   
           
    //        const blockController = block.getComponent('BlockController')
    //        blockController._line = Global.height
    //        blockController._column = columnNumber
    //     }
    },



});
