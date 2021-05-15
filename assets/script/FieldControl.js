cc.Class({
    extends: cc.Component,

    properties: {
        numberOfCollums: {
            type: cc.Integer,
            default: 10
        },
        numberOfLines: {
            type: cc.Integer,
            default: 10
        },       
        block: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.numberOfCollums = Global.width
        this.numberOfLines = Global.height
        this.SetSizeField ()
    },

    start () {
        this.CheckingTheNumberOfBlocks()
    },

    // update (dt) {},

    SetSizeField () {
        this.node.setScale(cc.Vec2(0.1*this.numberOfCollums, 0.1*this.numberOfLines))
    },

    CheckingTheNumberOfBlocks () {
        for (var columnNumber = 0; columnNumber < this.numberOfCollums; columnNumber++){
            const _x = (columnNumber + 0.5) * this.block.data.width / this.node.scaleX - this.node.width/2
            const p1 = this.node.convertToWorldSpaceAR (new cc.Vec2(_x, -400), p1)
            const p2 = this.node.convertToWorldSpaceAR (new cc.Vec2(_x, 400), p2)
            var results = cc.director.getPhysicsManager().rayCast (p1, p2, cc.RayCastType.All)
            
            if (results.length < this.numberOfLines) {
                this.CreatingBlocks (columnNumber, this.numberOfLines - results.length)
            }
        }
        var callFunc = cc.callFunc(function () {
            cc.find('Canvas/Moves/NumberOfPossibleMoves/NumberOfPossibleMovesText').getComponent(cc.Label).string = 
            'Доступно\n' + cc.find('Canvas/GameController').getComponent('BlocksController').NumberOfMoves()})
        var delay = cc.delayTime(this.block.data.getComponent('BlockController').blockSpawnTime + 0.01)
        var seq = cc.sequence(delay, callFunc)
        this.node.runAction(seq)
    },

    CreatingBlocks (columnNumber, numberOfBlocks) {
        const sizeCollliderBlock = this.block.data.getComponent(cc.PhysicsBoxCollider).size
        const _x = (columnNumber + 0.5) * this.block.data.width / this.node.scaleX - this.node.width/2
        var _y = (this.numberOfLines - 0.5)*sizeCollliderBlock.height / this.node.scaleY - this.node.height/2
        for (var i = 0; i < numberOfBlocks; i++){
           var block = cc.instantiate(this.block)
           block.setPosition(_x, _y) 
           this.node.addChild(block, this.numberOfLines - i, `Block`)
           _y = _y - sizeCollliderBlock.height / this.node.scaleY                  
        }
    },



});
