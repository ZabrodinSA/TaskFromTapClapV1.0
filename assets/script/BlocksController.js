cc.Class({
    extends: cc.Component,

    properties: {
        K: {
            type: cc.Integer,
            default: 2
        },
        blocksMove: {
            type: Boolean,
            default: false
        }
    },

    // LIFE-CYCLE CALLBACKS:
    
    // onLoad () {},

    // start () {},

    // update (dt) {},

    ClickHandler () {
        this.OffMouseForAllBlocks()
        var field = cc.find('/Canvas/Field')
        var fieldControl = field.getComponent('FieldControl')
        var allBlocks = this.FindAllBlocks()
        var allOmittedBlocks = []
        var allNotOmittedBlocks = []
        for (var i = 0; i < allBlocks.length; i++) {
            // allBlocks[i].getComponent('BlockController').OffMouse()
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
        var gameController = cc.find('Canvas/GameController').getComponent('GameController')
        gameController.SetNumberOfMoves()
        gameController.SetScore(allOmittedBlocks.length)
        const moveTime = allOmittedBlocks[0].getComponent('BlockController').blockMovementTime
        const distance = allOmittedBlocks[0].getComponent(cc.PhysicsBoxCollider).size.height / allOmittedBlocks[0].parent.scaleY
        const destructionTime = allOmittedBlocks[0].getComponent('BlockController').blockDestructionTime
        const spawnTime = allOmittedBlocks[0].getComponent('BlockController').blockSpawnTime
        var delay = 0
        var actions = [[]]
        actions.length = allOmittedBlocks.length
        for (var i = 0; i < actions.length; i++) {
            actions[i] = new Array(0)
        }
        function move (_block, _count) {
            _block.runAction(cc.moveTo(moveTime * _count, _block.x, _block.y - distance * _count))
        }
        function destroyBlock (_block) {
            _block.destroy()            
        }
        for (var i = 0; i < allOmittedBlocks.length; i++) {
            var actionScale = cc.scaleTo(destructionTime, 0, 0)
            actions[i].push(actionScale)
            var countMove = 1
            var result = allOmittedBlocks[i].getComponent('BlockController').RaysFromTheBlock(allOmittedBlocks[i], 'Up')
                if (result.length != 0) {
                    var resultBlock =result[0].collider.node
                    if (!resultBlock.getComponent('BlockController').blockOmitted) {
                        SetCountMove (allOmittedBlocks[i])
                        MoveAllTopBlocks( resultBlock, countMove)
                    }
                }
            var tempDelay = moveTime * countMove
            if (delay < tempDelay) {
                delay = tempDelay
            }

            function MoveAllTopBlocks (_block, _count) {
                var actionMove = cc.callFunc( function () {move(_block, _count)}, _block)
                actions[i].push(actionMove)
                _block.zIndex -= _count
                var result = _block.getComponent('BlockController').RaysFromTheBlock(_block, 'Up')
                if (result.length != 0) {
                    var resultBlock =result[0].collider.node
                    if (!resultBlock.getComponent('BlockController').blockOmitted) {
                        MoveAllTopBlocks(resultBlock, _count)
                    } 
                }
            }

            function SetCountMove (_block) {
                var result = _block.getComponent('BlockController').RaysFromTheBlock(_block, 'Down')
                if (result.length != 0) {
                    var resultBlock = result[0].collider.node
                    if (resultBlock.getComponent('BlockController').blockOmitted) {
                        countMove ++
                        SetCountMove (resultBlock)
                    } else {
                        SetCountMove (resultBlock)
                    }
                }
            }             
        }
        for (var i = 0; i < allOmittedBlocks.length; i++) {
            var callFuncDestroy = cc.callFunc(destroyBlock, allOmittedBlocks[i])
            var actionDelayMove = cc.delayTime(delay)
            actions[i].push(actionDelayMove)
            if ( i == allOmittedBlocks.length - 1) {
                var callFuncCreate = cc.callFunc(function () {fieldControl.CheckingTheNumberOfBlocks ()})
                actions[i].push(callFuncCreate)
            }
            var actionDelaySpawn = cc.delayTime(spawnTime)
            actions[i].push(actionDelaySpawn)
            if ( i == allOmittedBlocks.length - 1) {
                var callFuncOnMouseForAllBlocks = cc.callFunc(function () {cc.find('/Canvas/GameController').getComponent('BlocksController').OnMouseForAllBlocks ()})
                actions[i].push(callFuncOnMouseForAllBlocks)
            }
            actions[i].push(callFuncDestroy)
            
            var seq = cc.sequence(actions[i])
            allOmittedBlocks[i].runAction(seq)
        }
    },

    OnMouseForAllBlocks () { 
        this.blocksMove = false
        var allBlocks = this.FindAllBlocks()
        for (var i = 0; i < allBlocks.length; i++) {
            allBlocks[i].getComponent('BlockController').OnMouse()
        }
    },

    OffMouseForAllBlocks () {
        this.blocksMove = true
        var allBlocks = this.FindAllBlocks()
        for (var i = 0; i < allBlocks.length; i++) {
            allBlocks[i].getComponent('BlockController').OffMouse()
        }
    },

    FindAllBlocks () {
        var allNodes = cc.find('/Canvas/Field').children
        var allBlocks = []
        for (var i = 0; i < allNodes.length; i++) {
            if (allNodes[i].name == 'Block' ) {
                allBlocks.push(allNodes[i])
            }
        }
        return allBlocks
    },

    Mixing () {
        var gameController = cc.find('Canvas/GameController').getComponent('GameController')
        if (gameController.numberOfStirring > 0 && !this.blocksMove) {
            this.OffMouseForAllBlocks ()
            gameController.SetNumberOfStirring()
            var allBlocks = this.FindAllBlocks ()
            const moveTime = 5 * allBlocks[0].getComponent('BlockController').blockMovementTime
            var allPositionAndIndex = []

            for (var i = 0; i < allBlocks.length; i++) {
                var temp = {
                    position: cc.Vec3, 
                    index: cc.Integer
                }
                temp.index = allBlocks[i].zIndex
                temp.position = allBlocks[i].getPosition()
                allPositionAndIndex.push (temp)
                }
        
            allPositionAndIndex = shuffle (allPositionAndIndex)

            for (var i = 0; i < allBlocks.length; i++) {
                var actionMove = cc.callFunc( function (block, blockPosition) {
                    block.runAction(cc.moveTo(moveTime, blockPosition.x, blockPosition.y))
                }, allBlocks[i], allPositionAndIndex[i].position)
                var delay = cc.delayTime(moveTime + 0.001) 
                allBlocks[i].zIndex = allPositionAndIndex[i].index
                if ( i == allBlocks.length - 1) {
                    var callFuncNumberOfMoves = cc.callFunc(function () {
                        cc.find('Canvas/Moves/NumberOfPossibleMoves/NumberOfPossibleMovesText').getComponent(cc.Label).string = 
                        'Доступно\n' + cc.find('Canvas/GameController').getComponent('BlocksController').NumberOfMoves()})
                    var callFuncOnMouse = cc.callFunc(function () {cc.find('/Canvas/GameController').getComponent('BlocksController').OnMouseForAllBlocks ()})
                    var seq = cc.sequence(actionMove,delay, callFuncNumberOfMoves, callFuncOnMouse)
                    allBlocks[i].runAction(seq)
                } else {
                    allBlocks[i].runAction(actionMove)
                }
            }        
        }
        function shuffle(arr){
            var j, temp;
            for(var i = arr.length - 1; i > 0; i--){
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
        var allBlocks = this.FindAllBlocks ()
        var _numberOfMoves = 0
        for (var i = 0; i < allBlocks.length; i++) {
            if (!allBlocks[i].getComponent('BlockController').blockOmitted) {
                var countBefore = this.CountOmittedBlocks ()
                allBlocks[i].getComponent('BlockController').EnterToBlock ()
                var countAfter = this.CountOmittedBlocks ()
                if (countAfter - countBefore >= this.K) {
                    _numberOfMoves ++
                }           
            }
        }
        allBlocks[0].getComponent('BlockController').LeaveToBlock()               
        this.OnMouseForAllBlocks ()
        return _numberOfMoves       
    },

    CountOmittedBlocks () {
        var _allBlocks = this.FindAllBlocks()
        var count = 0
        for (var i = 0; i <_allBlocks.length; i++) {
            if (_allBlocks[i].getComponent('BlockController').blockOmitted) {
                count ++ 
            }
        } 
        return count           
    } 
});
