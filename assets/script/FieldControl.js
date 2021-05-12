cc.Class({
    extends: cc.Component,

    properties: {
        numberOfCollums: {
            get () {
                return this._numberOfCollums
            },
            set (value) {
                if (value > 0){
                    this._numberOfCollums = value > 10 ? 10 : Math.ceil(value)   
                }
                else {
                    this._numberOfCollums = 1
                } 
            }, 
            type: Number,
            default: 10
        },
        numberOfLines: {
            get () {
                return this._numberOfLines
            },
            set (value) {
                if (value > 0){
                    this._numberOfLines = value > 10 ? 10 : Math.ceil(value)   
                }
                else {
                    this._numberOfLines = 1
                } 
            }, 
            type: Number,
            default: 10
        },       
        block: cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.SetSizeField ()
        this.CreatingNewBlocks (6)
    },

     update (dt) {

     },

    SetSizeField () {
        var nodeBlock = this.block.data
        var sizeBlock = nodeBlock.getContentSize()
        var sizeField = this.node.getContentSize()

        sizeField.width = sizeBlock.width*this.numberOfCollums
        sizeField.height = sizeBlock.height*this.numberOfLines
        this.node.setContentSize(sizeField) 
    },

    CreatingNewBlocks (count) {
        var v1 = new cc.Vec2(count, 1000)
        var v2 = new cc.Vec2(count, -1000)
        // var physicsManager = cc.director.getPhysicsManager()
        // physicsManager.enabled = true
        var result = cc.director.getPhysicsManager().rayCast (v1, v2)
        if (result.length!=0) {
            cc.log(result[0].point)
        }
    },

});
