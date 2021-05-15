cc.Class({
    extends: cc.Component,

    properties: {
        width: {
            get () {
                return this._width
            },
            set (value) {
                if (value > 0){
                    this._width = value > 10 ? 10 : Math.ceil (value)   
                }
                else {
                    this._width = 1
                } 
            }, 
        },

        height: {
            get () {
                return this._height
            },
            set (value) {
                if (value > 0){
                    this._height = value > 10 ? 10 : Math.ceil (value)     
                }
                else {
                    this._height = 1
                } 
            }, 
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    },

    start () {

    },

    // update (dt) {},

    SetWidth () {
        this.width = cc.find('Canvas/StartWindow/Width').getComponent(cc.EditBox).string
        Global.width = this.width
        cc.find('Canvas/StartWindow/Width').getComponent(cc.EditBox).string = this.width
    },

    SetHeight () {
        this.height = cc.find('Canvas/StartWindow/Height').getComponent(cc.EditBox).string
        Global.height = this.height
        cc.find('Canvas/StartWindow/Height').getComponent(cc.EditBox).string = this.height
    },

    StartGame () {
        if (this.width == undefined) {
            cc.find('Canvas/StartWindow/Message').getComponent(cc.Label).string = 'Введите ширину поля'
        } else if (this.height == undefined) {
            cc.find('Canvas/StartWindow/Message').getComponent(cc.Label).string = 'Введите высоту поля'
        } else {
            cc.director.loadScene('Game')
        }
    }
});
