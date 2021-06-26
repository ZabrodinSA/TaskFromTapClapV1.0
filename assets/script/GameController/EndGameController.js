cc.Class({
    extends: cc.Component,

    properties: {
        statusNode: {
            type: cc.Node,
            default:  undefined
        },   
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if (game.statusGame == 'win') {
            this.statusNode.getComponent(cc.Label).string = 'Вы выиграли'
        } else {
            this.statusNode.getComponent(cc.Label).string = 'Вы проиграли'
        }
    },

    // start () {},

    // update (dt) {},

    NewSize () {
        cc.director.loadScene('StartGame')
    },

    StartOver () {
        const columns = game.field.numberOfColumns
        const lines = game.field.numberOfLines
        game = new Game (columns, lines)
        cc.director.loadScene('Game')
    }
});
