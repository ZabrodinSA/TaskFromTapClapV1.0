cc.Class({
    extends: cc.Component,

    properties: {
        _maxWidth: {
            type: cc.Integer,
            default: 10
        },
        _minWidth: {
            type: cc.Integer,
            default: 1
        },
        _maxHeight: {
            type: cc.Integer,
            default: 10
        },
        _minHeight: {
            type: cc.Integer,
            default: 1
        },
        widthNode: {
            type: cc.Node,
            default: undefined
        },
        heightNode: {
            type: cc.Node,
            default: undefined
        },
        messageNode: {
            type: cc.Node,
            default: undefined
        },
        width: {
            get () {
                return this._width
            },
            set (value) {
                if (value > this._minWidth){
                    this._width = value > this._maxWidth ? this._maxWidth : Math.ceil (value)   
                }
                else {
                    this._width = this._minWidth
                } 
            }, 
        },
        height: {
            get () {
                return this._height
            },
            set (value) {
                if (value > this._minHeight){
                    this._height = value > this._maxHeight ? this._maxHeight : Math.ceil (value)     
                }
                else {
                    this._height = this._minHeight
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
        this.width = this.widthNode.getComponent(cc.EditBox).string
        Global.width = this.width
        this.widthNode.getComponent(cc.EditBox).string = this.width
    },

    SetHeight () {
        this.height = this.heightNode.getComponent(cc.EditBox).string
        Global.height = this.height
        this.heightNode.getComponent(cc.EditBox).string = this.height
    },

    StartGame () {
        if (this.width == undefined) {
            this.messageNode.getComponent(cc.Label).string = 'Введите ширину поля'
        } else if (this.height == undefined) {
            this.messageNode.getComponent(cc.Label).string = 'Введите высоту поля'
        } else {
            cc.director.loadScene('Game')
        }
    }
});
