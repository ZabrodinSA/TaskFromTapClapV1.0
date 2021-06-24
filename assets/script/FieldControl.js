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
        this._numberOfCollums = Global.width
        this._numberOfLines = Global.height
        this.SetSizeField ()
    },

    start () {
        this.CheckingTheNumberOfBlocks()
    },

    // update (dt) {},

    SetSizeField () {
        this.node.setScale(cc.Vec2(this.sizeScale * this._numberOfCollums, this.sizeScale * this._numberOfLines))
    },

    CheckingTheNumberOfBlocks () {
        for (let columnNumber = 0; columnNumber < this._numberOfCollums; columnNumber++){
            const _x = (columnNumber + 0.5) * this.block.data.width / this.node.scaleX - this.node.width / 2 // координата х середины каждого столбца 
            const _y = this.node.height / 1.5                                                                // координата y ниже первой строки 
            const p1 = this.node.convertToWorldSpaceAR (new cc.Vec2(_x, -_y), p1)
            const p2 = this.node.convertToWorldSpaceAR (new cc.Vec2(_x, _y), p2)
            const results = cc.director.getPhysicsManager().rayCast (p1, p2, cc.RayCastType.All)
            
            if (results.length < this._numberOfLines) {
                this.CreatingBlocks (columnNumber, this._numberOfLines - results.length)
            }
        }
        let numberOfPossibleMoves = this.numberOfPossibleMovesTextNode
        const gameController = this.gameControllerNode.getComponent('BlocksController')
        const callFunc = cc.callFunc(function () {
            numberOfPossibleMoves.getComponent(cc.Label).string = 'Доступно\n' + gameController.NumberOfMoves()})
        const delay = cc.delayTime(this.block.data.getComponent('BlockController').blockSpawnTime)
        const seq = cc.sequence(delay, callFunc)
        this.node.runAction(seq)
    },

    CreatingBlocks (columnNumber, numberOfBlocks) {
        const sizeCollliderBlock = this.block.data.getComponent(cc.PhysicsBoxCollider).size
        const _x = (columnNumber + 0.5) * this.block.data.width / this.node.scaleX - this.node.width / 2    //координата х columnNumber столбца
        let _y = (this._numberOfLines - 0.5)*sizeCollliderBlock.height / this.node.scaleY - this.node.height / 2    //координата y верхней линии
        for (let i = 0; i < numberOfBlocks; i++){
           const block = cc.instantiate(this.block)
           block.setPosition(_x, _y) 
           this.node.addChild(block, this._numberOfLines - i, `Block`)
           _y = _y - sizeCollliderBlock.height / this.node.scaleY                  
        }
    },



});
