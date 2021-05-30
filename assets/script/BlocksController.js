cc.Class({
    extends: cc.Component,

    properties: {
        K: {
            type: cc.Integer,
            default: 2
        },
        _blocksMove: {
            type: Boolean,
            default: false
        },
        mixingTime: {
            type: cc.Float,
            default: 1.5
        },
        fieldNode: {
            type: cc.Node,
            default:  undefined
        }, 
        numberOfPossibleMovesTextNode: {
            type: cc.Node,
            default:  undefined
        },   
    },

    // LIFE-CYCLE CALLBACKS:
    
    // onLoad () {},

    // start () {},

    // update (dt) {},

    ClickHandler () {
        this.OffMouseForAllBlocks()
        const fieldControl = this.fieldNode.getComponent('FieldControl')
        const allBlocks = this.FindAllBlocks()
        const allOmittedBlocks = []
        const allNotOmittedBlocks = []
        for (let i = 0; i < allBlocks.length; i++) {
            if (allBlocks[i].getComponent('BlockController').blockOmitted) {
                allOmittedBlocks.push(allBlocks[i])
            } else {
                allNotOmittedBlocks.push(allBlocks[i])
            }
        }    

        if (allOmittedBlocks.length >= this.K) {
            this.DestroyAllOmittedBlocks(allOmittedBlocks, fieldControl)
        } else {
            this.OnMouseForAllBlocks ()
        }
    },

    DestroyAllOmittedBlocks (allOmittedBlocks, fieldControl) {
        const gameController = this.node.getComponent('GameController')
        gameController.ReduceTheNumberOfMoves()
        gameController.SetScore(allOmittedBlocks.length)
        const blockController = allOmittedBlocks[0].getComponent('BlockController')
        const moveTime = blockController.blockMovementTime
        const distance = allOmittedBlocks[0].getComponent(cc.PhysicsBoxCollider).size.height / allOmittedBlocks[0].parent.scaleY
        const destructionTime = blockController.blockDestructionTime
        const spawnTime = blockController.blockSpawnTime
        let delay = 0
        let actions = [[]]
        actions.length = allOmittedBlocks.length
        for (let i = 0; i < actions.length; i++) {
            actions[i] = new Array(0)
        }
        function move (_block, _count) {
            _block.runAction(cc.moveTo(moveTime * _count, _block.x, _block.y - distance * _count))
        }
        function destroyBlock (_block) {
            _block.destroy()            
        }
        for (let i = 0; i < allOmittedBlocks.length; i++) {
            const actionScale = cc.scaleTo(destructionTime, 0, 0)
            actions[i].push(actionScale)
            let countMove = 1
            const result = allOmittedBlocks[i].getComponent('BlockController').RaysFromTheBlock(allOmittedBlocks[i], 'Up')
                if (result.length != 0) {
                    let resultBlock =result[0].collider.node
                    if (!resultBlock.getComponent('BlockController').blockOmitted) {
                        SetCountMove (allOmittedBlocks[i])
                        MoveAllTopBlocks( resultBlock, countMove)
                    }
                }
            const tempDelay = moveTime * countMove
            if (delay < tempDelay) {
                delay = tempDelay
            }

            function MoveAllTopBlocks (_block, _count) {
                const actionMove = cc.callFunc( function () {move(_block, _count)}, _block)
                actions[i].push(actionMove)
                _block.zIndex -= _count
                const result = _block.getComponent('BlockController').RaysFromTheBlock(_block, 'Up')
                if (result.length != 0) {
                    const resultBlock =result[0].collider.node
                    if (!resultBlock.getComponent('BlockController').blockOmitted) {
                        MoveAllTopBlocks(resultBlock, _count)
                    } 
                }
            }

            function SetCountMove (_block) {
                const result = _block.getComponent('BlockController').RaysFromTheBlock(_block, 'Down')
                if (result.length != 0) {
                    const resultBlock = result[0].collider.node
                    if (resultBlock.getComponent('BlockController').blockOmitted) {
                        countMove ++
                        SetCountMove (resultBlock)
                    } else {
                        SetCountMove (resultBlock)
                    }
                }
            }             
        }
        for (let i = 0; i < allOmittedBlocks.length; i++) {
            const callFuncDestroy = cc.callFunc(destroyBlock, allOmittedBlocks[i])
            const actionDelayMove = cc.delayTime(delay)
            actions[i].push(actionDelayMove)
            if ( i == allOmittedBlocks.length - 1) {
                let callFuncCreate = cc.callFunc(function () {fieldControl.CheckingTheNumberOfBlocks ()})
                actions[i].push(callFuncCreate)
            }
            const actionDelaySpawn = cc.delayTime(spawnTime)
            actions[i].push(actionDelaySpawn)
            if ( i == allOmittedBlocks.length - 1) {
                const blocksController = this
                const callFuncOnMouseForAllBlocks = cc.callFunc(function () {blocksController.OnMouseForAllBlocks ()})
                actions[i].push(callFuncOnMouseForAllBlocks)
            }
            actions[i].push(callFuncDestroy)
            
            const seq = cc.sequence(actions[i])
            allOmittedBlocks[i].runAction(seq)
        }
    },

    OnMouseForAllBlocks () { 
        this._blocksMove = false
        const allBlocks = this.FindAllBlocks()
        for (let i = 0; i < allBlocks.length; i++) {
            allBlocks[i].getComponent('BlockController').OnMouse()
        }
    },

    OffMouseForAllBlocks () {
        this._blocksMove = true
        const allBlocks = this.FindAllBlocks()
        for (let i = 0; i < allBlocks.length; i++) {
            allBlocks[i].getComponent('BlockController').OffMouse()
        }
    },

    FindAllBlocks () {
        const allNodes = this.fieldNode.children
        let allBlocks = []
        for (let i = 0; i < allNodes.length; i++) {
            if (allNodes[i].name == 'Block' ) {
                allBlocks.push(allNodes[i])
            }
        }
        return allBlocks
    },

    Mixing () {
        const gameController = this.node.getComponent('GameController')
        const blocksController = this
        if (gameController._numberOfStirring > 0 && !this._blocksMove) {
            this.OffMouseForAllBlocks ()
            gameController.ReduceTheNumberOfStirring()
            const allBlocks = this.FindAllBlocks ()
            const moveTime = this.mixingTime
            let allPositionAndIndex = []

            for (let i = 0; i < allBlocks.length; i++) {
                const temp = {
                    position: cc.Vec3, 
                    index: cc.Integer
                }
                temp.index = allBlocks[i].zIndex
                temp.position = allBlocks[i].getPosition()
                allPositionAndIndex.push (temp)
                }
        
            allPositionAndIndex = shuffle (allPositionAndIndex)

            for (let i = 0; i < allBlocks.length; i++) {
                const actionMove = cc.callFunc( function (block, blockPosition) {
                    block.runAction(cc.moveTo(moveTime, blockPosition.x, blockPosition.y))
                }, allBlocks[i], allPositionAndIndex[i].position)
                const delay = cc.delayTime(moveTime) 
                allBlocks[i].zIndex = allPositionAndIndex[i].index
                if ( i == allBlocks.length - 1) {
                    const numberOfPossibleMovesText = this.numberOfPossibleMovesTextNode
                    const callFuncNumberOfMoves = cc.callFunc(function () {
                        numberOfPossibleMovesText.getComponent(cc.Label).string = 'Доступно\n' + blocksController.NumberOfMoves()})
                    const callFuncOnMouse = cc.callFunc(function () {
                        blocksController.OnMouseForAllBlocks ()})
                    const seq = cc.sequence(actionMove,delay, callFuncNumberOfMoves, callFuncOnMouse)
                    allBlocks[i].runAction(seq)
                } else {
                    allBlocks[i].runAction(actionMove)
                }
            }        
        }

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
    },

    NumberOfMoves () {
        this.OffMouseForAllBlocks ()
        const gameController = this.node.getComponent('GameController')
        const allBlocks = this.FindAllBlocks ()
        const blockController = allBlocks[0].getComponent('BlockController')
        let _numberOfMoves = 0
        for (let i = 0; i < allBlocks.length; i++) {
            const _blockController = allBlocks[i].getComponent('BlockController')
            if (!_blockController.blockOmitted) {
                const countBefore = this.CountOmittedBlocks ()
                _blockController.EnterToBlock ()
                const countAfter = this.CountOmittedBlocks ()
                if (countAfter - countBefore >= this.K) {
                    _numberOfMoves ++
                }           
            }
        }
        blockController.LeaveToBlock()               
        this.OnMouseForAllBlocks ()
        if (gameController._numberOfStirring == 0 && _numberOfMoves == 0) {
            gameController.EndGame () 
        }
        return _numberOfMoves     
    },

    CountOmittedBlocks () {
        const _allBlocks = this.FindAllBlocks()
        let count = 0
        for (let i = 0; i <_allBlocks.length; i++) {
            if (_allBlocks[i].getComponent('BlockController').blockOmitted) {
                count ++ 
            }
        } 
        return count           
    } 
});
