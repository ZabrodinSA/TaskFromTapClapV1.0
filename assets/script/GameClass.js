import { Block, SuperBlock } from "./BlockClasses"
import { Field  } from "./FieldClass"

export class Game {
    constructor (numberOfColumns, numberOfLines, K = 2, L = 3) {
        this.field = new Field (numberOfColumns, numberOfLines)
        this._winScore = this.InitialWinScore ()
        this.numberOfMixing = this.InitialNumberOfMixing ()
        this.numberOfMoves = this.InitialNumberOfMoves ()
        this.curScore = 0
        this.statusGame = 'game is on'
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
        let numberOfMoves = 0
        this.field.ExecuteForAllBlocks ((blocks, column, line) => {
            const selectedBlocksWere = this.field.allocatedBlockCounter
            this.field.SelectTheBlock (column, line)
            const selectedBlocksBecame = this.field.allocatedBlockCounter
            if (selectedBlocksBecame - selectedBlocksWere >= this.K ) {
                numberOfMoves ++
            }
        })
        this.field.DoNotSelectAllBlocks()
        return numberOfMoves
    }

    ClickHandler (column, line) {
        let callbacks = []
        if (this.field.allocatedBlockCounter >= this.L && this.field.blocks[column][line].name != 'super') {
            callbacks.push(SuperBlock.SuperBlockCallBack)
        }
        const count = this.field.blocks[column][line].Click(this, callbacks)
        this.numberOfPossibleMoves = this.CheckingNumberOfMoves()
        this.CheckEndGame(count) 
        return count
    }

    CheckEndGame (count) {
        if (count > 0) {
            this.numberOfMoves --
            this.curScore += count
        }   
        
        if (this.numberOfMoves >= 0) {
            if (this.curScore >= this.winScore) {
                this.statusGame = 'win'
            } else if (this.numberOfMoves == 0){
                this.statusGame = 'losing'
            }
        } 
        if (this.numberOfPossibleMoves == 0 && this.numberOfMixing == 0) {
            this.statusGame = 'losing'
        }
    }

    Mixing() {
        let mixing = false
        if (this.numberOfMixing > 0) {
            let temp = []
            this.field.ExecuteForAllBlocks ((blocks, column, line) => {
                temp.push(blocks[column][line])
            })
        

            temp = shuffle(temp)            
            let count = 0
            this.field.ExecuteForAllBlocks ((blocks, column, line) => {
                blocks[column][line] = temp[count]
                blocks[column][line].column = column
                blocks[column][line].line = line
                count ++
            })
            this.numberOfMixing --
            mixing = true
            this.CheckEndGame(0)
        }
        return mixing

        function shuffle(arr){
            let j, temp;
            for(let i = arr.length - 1; i > 0; i--){
                j = Math.floor(Math.random()*(i + 1));
                temp = arr[j];
                arr[j] = arr[i];
                arr[i] = temp;
            }
            return arr;
        }        
    }   
}





