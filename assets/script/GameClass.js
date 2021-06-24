import { Block, SuperBlock } from "./BlockClasses"
import { Field  } from "./FieldClass"

export class Game {
    constructor (numberOfColumns, numberOfLines, K = 2, L = 3) {
        this.field = new Field (numberOfColumns, numberOfLines)
        this._winScore = this.InitialWinScore ()
        this.numberOfMixing = this.InitialNumberOfMixing ()
        this.numberOfMoves = this.InitialNumberOfMoves ()
        this.curScore = 0
        this._K = K
        this._L = L
        this.numberOfPossibleMoves = this.CheckingNumberOfMoves ()
    }
    get K() {return this._K}
    get L() {return this._L}
    get winScore() {return this._winScore}

    InitialWinScore () {
        return this.field.numberOfColumns * this.field.numberOfLines
    }
    InitialNumberOfMixing () {
        if (this.field.numberOfColumns > this.field.numberOfLines) {
            return this.field.numberOfColumns - this.field.numberOfLines
        } else {
            return this.field.numberOfLines - this.field.numberOfColumns
        }
    }
    InitialNumberOfMoves () {
        if (this.field.numberOfColumns > this.field.numberOfLines) {
            return this.field.numberOfColumns
        } else {
            return this.field.numberOfLines
        }        
    }

    CheckingNumberOfMoves () {
        let numberOfColumns = 0
        this.field.FunctionForAllBlocks ((blocks, column, line) => {
            const selectedBlocksWere = this.field.allocatedBlockCounter
            this.field.SelectTheBlock (column, line)
            const selectedBlocksBecame = this.field.allocatedBlockCounter
            if (selectedBlocksBecame - selectedBlocksWere >= this.K) {
                numberOfColumns ++
            }
        })
        this.field.DoNotSelectAllBlocks()
        return numberOfColumns
    }

    ClickHandler (column, line) {
        let callbacks = []
        if (this.field.allocatedBlockCounter >= this.L) {
            callbacks.push(SuperBlock.SuperBlockCallBack)
        }
        this.field.blocks[column][line].Click(this, callbacks)      
    }
}





