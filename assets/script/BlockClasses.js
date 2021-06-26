class Block {
    constructor (column, line) {
        this.selected = false
        this.column = column
        this.line = line
    }

    Click (game, callbacks) {
        this.ExecuteCallbacks (game, callbacks)
        let numberOfDestroyedBlocks = 0
        var blocksForDeletion = []

        game.field.ExecuteForAllBlocks ((blocks, column, line) => {
            if (blocks[column][line].selected) {
                blocksForDeletion.push(blocks[column][line])
                numberOfDestroyedBlocks ++
            }
        })        
        this.DestroyedBlocks(game, blocksForDeletion)
        game.field.CreatingMissingBlocks()    
        return numberOfDestroyedBlocks
    }

    SelectTheBlock () {this.selected = true}

    DoNotSelectABlock () {this.selected = false}

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
        // if (column == 0 )
        this.name = ColorBlock.colors[cc.math.randomRangeInt(0, ColorBlock.colors.length)]
        // else {this.name = 'red'}
    }

    Click (game, callbacks) {
  
        if (game.field.allocatedBlockCounter >= game.K) {
            return super.Click(game, callbacks)
        }
        
    }
}

class SuperBlock extends Block {
    constructor (column, line) {
        super (column, line)
        this.name = 'super'
    }

    static SuperBlockCallBack (game, column, line) {
        game.field.blocks[column][line] = new SuperBlock (column, line)
    }

    SelectTheBlock (field) {
        super()
        field.ExecuteForAllBlocks ((blocks, column, line) => {
            if (this.column == column) {
                blocks[column][line].SelectTheBlock(field) 
            }
        })
    }
}

export {Block, ColorBlock, SuperBlock}
