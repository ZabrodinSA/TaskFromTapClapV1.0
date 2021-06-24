const { Game } = require("../GameClass");

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
            type: cc.Integer,
            default: undefined
        },
        height: {
            type: cc.Integer, 
            default: undefined
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // start () {},

    // update (dt) {},

    SetSize (size, max, min) {
        let rusultSize
        if (size > min){
            rusultSize = size > max ? max : Math.ceil (size)     
        }
        else {
            rusultSize = min
        } 
        return rusultSize
    },

    SetWidth () {
        this.width = this.SetSize(this.widthNode.getComponent(cc.EditBox).string, this._maxWidth, this._minWidth)
        Global.width = this.width//
        this.widthNode.getComponent(cc.EditBox).string = this.width
    },

    SetHeight () {
        this.height = this.SetSize(this.heightNode.getComponent(cc.EditBox).string, this._maxHeight, this._minHeight)
        Global.height = this.height//
        this.heightNode.getComponent(cc.EditBox).string = this.height
    },

    StartGame () {
        if (this.width == undefined) {
            this.messageNode.getComponent(cc.Label).string = 'Введите ширину поля'
        } else if (this.height == undefined) {
            this.messageNode.getComponent(cc.Label).string = 'Введите высоту поля'
        } else {
            game = new Game(this.width, this.height)
            // cc.log(game)
            cc.director.loadScene('Game')
        }
    },
    
});
