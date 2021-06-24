import * as BlockClasses from './BlockClasses'

export class Field {
    constructor(numberOfColumns, numberOfLines) {
        this._minLines = 1
        this._minColumns = 1
        this._numberOfColumns = numberOfColumns
        this._numberOfLines = numberOfLines
        this.blocks = [[]]
        this.blocks = new Array (numberOfColumns)
        for (let i = 0; i < numberOfColumns; i++) {
            this.blocks[i] = new Array (0)
        }
        this.allocatedBlockCounter = 0
        this.CreatingMissingBlocks()
    }  
     
    get minLines() {
        return this._minLines
    }
    get minColumns() {
        return this._minColumns
    }
    get numberOfLines() {
            return this._numberOfLines
        }
    get numberOfColumns() {
            return this._numberOfColumns
        }

    // SetSize (size, max, min) {
    //     let rusultSize
    //     if (size > min){
    //         rusultSize = size > max ? max : Math.ceil (size)     
    //     }
    //     else {
    //         rusultSize = min
    //     } 
    // }

    CreatingMissingBlocks () {
        this.FunctionForAllBlocks ((blocks, column, line) => {
            if (blocks[column][line] == undefined) {
                blocks[column].push(new BlockClasses.ColorBlock (column, line))
            }
        } )
    } 

    SelectTheBlock (column, line) {
        if (!this.blocks[column][line].selected) {
            this.allocatedBlockCounter++
            this.blocks[column][line].SelectTheBlock ()
            if (column + 1 < this.numberOfColumns) {
                this.SelectAdjacentBlock(this.blocks[column][line], this.blocks[column + 1][line])
            }
            if (column >= this.minColumns) {
                this.SelectAdjacentBlock(this.blocks[column][line], this.blocks[column - 1][line])
            }
            if (line + 1 < this.numberOfLines) {
                this.SelectAdjacentBlock(this.blocks[column][line], this.blocks[column][line + 1])
            }
            if (line >= this.minLines) {
                this.SelectAdjacentBlock(this.blocks[column][line], this.blocks[column][line - 1])
            }
        }
    }

    SelectAdjacentBlock (block, adjacentBlock) {
        if (!adjacentBlock.selected && adjacentBlock.name == block.name) {
            this.SelectTheBlock(adjacentBlock.column, adjacentBlock.line)
        } 
    }

    DoNotSelectAllBlocks () {
        this.allocatedBlockCounter = 0
        this.FunctionForAllBlocks((blocks, column, line) => {
            blocks[column][line].DoNotSelectABlock()
        })
    } 
    
    FunctionForAllBlocks (callBack) {
        for (var i = 0; i < this.numberOfColumns; i++) {
            for (var j = 0; j < this.numberOfLines; j++) {
                callBack(this.blocks, i, j)
            }
        }
    }
}
// let field = new Field(3, 3)
// // field.FunctionForAllBlocks(field.CreatingMissingBlocks)
// field.CreatingMissingBlocks()
// cc.log(field.blocks)
// field.SelectTheBlock(1, 1)
// cc.log(field.allocatedBlockCounter)
// field.DoNotSelectABlock()
// cc.log(field.allocatedBlockCounter)


