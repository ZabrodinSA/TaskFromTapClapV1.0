class Block {
    constructor (column, line) {
        this.selected = false
        this.column = column
        this.line = line
        // this.blockRight = blockRight
    }

    Click (game, callbacks) {
        return numberOfDestroyedBlocks
    }

    SelectTheBlock () {
        this.selected = true        
    }

    DoNotSelectABlock () {
        this.selected = false
    }

    DestroyedBlocks (game, blocksForDeletion = []) {
        for (var i = blocksForDeletion.length - 1; i >= 0; i--) {
            game.field.blocks[blocksForDeletion[i].column].splice(blocksForDeletion[i].line, 1)
        }
    }

    ExecuteCallbacks (game, callbacks) {
        for (i = 0; i < callbacks.length; i++) {
            let CallBack = callbacks[i]
            CallBack(game, this.column, this.line)
        }
    }
}

class ColorBlock extends Block {
    static colors = ['blue', 'green', 'purple', 'red', 'yellow']

    constructor (column, line) {
        super (column, line)
        if (column == 0 )
        {this.name = 'blue'}//ColorBlock.colors[cc.math.randomRangeInt(0, ColorBlock.colors.length)]
        else {this.name = 'red'}
    }

    Click (game, callbacks) {
        cc.log('click for color')
        this.ExecuteCallbacks (game, callbacks)
        let numberOfDestroyedBlocks = 0
        let blocksForDeletion = []
        if (game.field.allocatedBlockCounter >= game.K) {
            game.field.FunctionForAllBlocks ((blocks, column, line) => {
                if (blocks[column][line].selected) {
                    blocksForDeletion.push(blocks[column][line])
                    numberOfDestroyedBlocks ++
                }
            })
            this.DestroyedBlocks(game, blocksForDeletion)
            
            game.field.CreatingMissingBlocks()
        }
        return numberOfDestroyedBlocks
    }
}

class SuperBlock extends Block {
    constructor (column, line) {
        super (column, line)
        this.name = 'super'
    }

    static SuperBlockCallBack (game, column, line) {
        cc.log(`Super block call back `)

        game.field.blocks[column][line] = new SuperBlock (column, line)
    }

    Click (game, callbacks) {
        cc.log('click for super')

        this.ExecuteCallbacks (callbacks)
        let numberOfDestroyedBlocks = 0
        let blocksForDeletion = []

        game.field.FunctionForAllBlocks ((blocks, column, line) => {
            // if (blocks[column][line].selected) {
            //     blocksForDeletion.push(blocks[column][line])
            // }
        })
        this.DestroyedBlocks(blocksForDeletion)
        game.field.CreatingMissingBlocks()    
        return numberOfDestroyedBlocks
    }
}

export {Block, ColorBlock, SuperBlock}
