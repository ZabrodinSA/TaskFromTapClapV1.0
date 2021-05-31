cc.Class({
    extends: cc.Component,

    properties: {
        sizeScale: {
            type: cc.Float,
            default: 0.1
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    onLoad () {
        // this._numberOfCollums = Global.width
        // this._numberOfLines = Global.height
    },

    start () {
        this.SetSizeField ()

        const fieldControl = this.node.getComponent('FieldControl')
        fieldControl.CheckingTheNumberOfBlocks()
    },

    SetSizeField () {        
        this.node.setScale(cc.Vec2(this.sizeScale * Global.width, this.sizeScale * Global.height))
    },

    // update (dt) {},
});
