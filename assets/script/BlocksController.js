cc.Class({
    extends: cc.Component,

    properties: {
        K: {
            type: cc.Integer,
            default: 2
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
    },

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
            cc.log(spawnTime + 0.001)
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
        var allBlocks = this.FindAllBlocks()
        for (var i = 0; i < allBlocks.length; i++) {
            allBlocks[i].getComponent('BlockController').OnMouse()
        }
    },

    OffMouseForAllBlocks () {
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
});
