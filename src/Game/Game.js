import React, { useEffect, useReducer, useState } from "react"
import { Col, Container, Row } from "react-bootstrap"
import Swal from "sweetalert2"
import BoardAndRack from "../BoardAndRack"
import ControlButtons from "../ControlButtons/ControlButtons"
import ScoreKeeper from "../ScoreKeeper/ScoreKeeper"
import {
    getUniqueInts0,
    makePlayertable,
    subtractArrays,
} from "../Utils/helpers"
import {
    checkLegalPlacement,
    emptyOnRack,
    getAllNewWords,
    pickDisplayWord,
    rackPoints,
    readWord,
    recallTiles,
    score,
    shuffleRackTiles,
    tilesOnBoard,
    tilesOnRack,
    tilesPlayedNotSubmitted,
} from "./GameHelperFunctions"
import CheckDictionaryModal from "../CheckDictionaryModal/CheckDictionaryModal"
import Bag from "../Utils/Bag"
import ExchangeTilesModal from "../ExchangeTilesModal/ExchangeTilesModal"
import PassDeviceMessageModal from "../PassDeviceMessageModal/PassDeviceMessageModal"
import { randomUpTo } from "../Utils/helpers"
import { greetings } from "../Utils/Data"
import VictoryModal from "../VictoryModal/VictoryModal"
import {
    aiMove,
    makeAllSlots,
    makeRackPerms,
} from "./AIHelperFunctions"
import worker from 'workerize-loader!../Workers/worker'; // eslint-disable-line import/no-webpack-loader-syntax
import AIThinkingModal from "../AIThinkingModal/AIThinkingModal"
import Instructions from "../Instructions/Instructions"


const Game = ({ gameVariables, exitGame }) => {

    const initialTilesAndBag = {tiles: [], bag: Bag}
    const [showDict, setShowDict] = useState(false)
    const [showEx, setShowEx] = useState(false)
    const [lastPlayed, setLastPlayed] = useState([])
    const [pointsPossible, setPointsPossible] = useState(0)
    const [buttonsDisabled, setButtonsDisabled] = useState(false)
    const [selectedTiles, setSelectedTiles] = useState(new Set())
    const initialState = { mn: 0, cp: 0 }
    const [greeting, setGreeting] = useState("")
    const [showVictoryBox, setShowVictoryBox] = useState(false)
    const [gameIsOver, setGameIsOver] = useState(false)
    const [showAIThinking, setShowAIThinking] =  useState(false)
    const [aiSays, setAiSays] = useState("")
    const [showInstr, setShowInstr] = useState(false)
    const [numWorkersDone, setNumWorkersDone] = useState(0)

    //parsing incoming data from the welcome page
    const players = gameVariables.players
    const shufflePlayers = gameVariables.shufflePlayers
    const dictChecking = gameVariables.dictCheck === "1" ? true : false
    const maxPoints = parseInt(gameVariables.gameType)
    const maxSearches = {1: 1500, 2: 60000, 3: 150000}
    const playerTable = makePlayertable(players, shufflePlayers)
    const numPlayers = playerTable.length
    const AIPlayersExist = playerTable.filter((el) => el.level > 0).length > 0 //whether AI players exist
    const [playersAndPoints, setPlayersAndPoints] = useState(playerTable)
    const [showPassDevice, setShowPassDevice] = useState(playersAndPoints[0].level === 0)


    const gsreducer = (state, action) => {
        switch (action.type) {
            case "ADVANCE":
                return {
                    ...state,
                    mn: state.mn + 1,
                    cp: (state.mn + 1) % numPlayers,
                }
                case "REVERT":
                    return {
                        ...state,
                        mn: state.mn - 1,
                        cp: (state.mn - 1) % numPlayers,
                    }
            default:
                return state
        }
    }
    const [gameState, dispatch] = useReducer(gsreducer, initialState)

    const advanceGameState = () => {
        dispatch({ type: "ADVANCE" })
    }
    const revertGameState = () => {
        dispatch({ type: "REVERT" })
    }

    const tilesAndBagReducer = (state, action) => {
        switch (action.type) {
            case "UPDATE_TILES_AND_BAG":
                return {
                    ...state,
                    bag: action.bag,
                    tiles: action.tiles,
                }
            case "UPDATE_TILES":
                return {
                    ...state,
                    tiles: action.tiles,
                }
            default:
                return state
        }

    }

    const [tilesAndBag, tbdispatch] = useReducer(tilesAndBagReducer, initialTilesAndBag)

    const updateTilesAndBag = (newTiles, newBag) => {
        tbdispatch({type: "UPDATE_TILES_AND_BAG", bag: newBag, tiles: newTiles})
    }

    const updateTiles = (newTiles) =>{
        if (newTiles=== undefined){
            throw new Error("updateTiles called with undefined array");
        }

        if (newTiles === null){
            throw new Error("updateTiles called with null array");
        }
        tbdispatch({type: "UPDATE_TILES", tiles: newTiles})
    }
    

    const generateGreeting = (wordplayed) => {
        let greetlist = wordplayed===wordplayed.toUpperCase() ? greetings.normal : greetings.passExchange
        return greetlist[randomUpTo(greetlist.length-1)]
    }


    useEffect(() => {
        if (gameIsOver){
            return
        }
        if (gameOver()) {
            return
        }
        const { cp: currentPlayer } = gameState

        lastPlayed.length === 0? setGreeting("Lets Get Started!"): setGreeting(generateGreeting(lastPlayed[0].word))
        
        setShowPassDevice((x) => {
            return (
                !AIPlayersExist && playersAndPoints[currentPlayer].level === 0
            )
        })

        if (playersAndPoints[currentPlayer].level > 0) {
            aiGetTiles().then((newTilesAndBag) =>
                delay(500, newTilesAndBag).then((newTilesAndBag) => aiPlay(newTilesAndBag))
            )
            return
        }
        replenishRack()
    // eslint-disable-next-line
    }, [gameState])

    useEffect(() => {
        const { cp: currentPlayer } = gameState
        const {tiles} = tilesAndBag
        checkLegalPlacement(tiles, false)
            ? setPointsPossible((x) =>
                  score(tiles, playersAndPoints[currentPlayer].rack)
              )
            : setPointsPossible((x) => 0)
    // eslint-disable-next-line
    }, [tilesAndBag])

    ////////START GAME OVER FUNCTION//////////

    const gameOver = () => {
        //a player has reached or exceeded max points
        const { mn: moveNumber } = gameState
        const {tiles, bag} = tilesAndBag
        const prevPlayer = Math.max((moveNumber - 1) % numPlayers, 0)
        if (parseInt(playersAndPoints[prevPlayer].points) >= maxPoints) {
            revertGameState()
            setShowVictoryBox((x) => true)
            setButtonsDisabled((x) => true)
            setGameIsOver(true)
            return true
        }
        ///////
        if (bag.length === 0) {
            //no tiles left
            let playersAndPointsCopy = Array.from(playersAndPoints)
            for (let i = 0; i < playersAndPointsCopy.length; i++) {
                playersAndPointsCopy[i].points -= rackPoints(
                    playersAndPointsCopy[i].rack,
                    tiles
                )
            }
            setPlayersAndPoints(playersAndPointsCopy)
            setShowVictoryBox((x) => true)
            setButtonsDisabled((x) => true)
            setGameIsOver(true)
            return true
        }

        return false
    }

    ///////END GAME OVER FUNCTION///////////////

    ///////////////////////// START EXCHANGE TILES MODAL///////////////////////////////////////

    const clickHandlerExt = (event) => {
        let clickedTileNo =
            playersAndPoints[gameState.cp].rack +
            event.currentTarget.parentNode.parentNode.id[1]

        setSelectedTiles((x) => {
            if (x.has(clickedTileNo)) {
                x.delete(clickedTileNo)
            } else {
                x.add(clickedTileNo)
            }
            return x
        })
    }
    const exchange = () => {
        const { cp: currentPlayer } = gameState
        const {tiles} = tilesAndBag
        recallTiles(tiles, playersAndPoints[currentPlayer].rack)
        setShowEx(true)
    }
    const hideModalEx = () => {
        setSelectedTiles((x) => {
            return new Set()
        })
        setShowEx(false)
    }

    const hideModalPassDevice = () => {
        setShowPassDevice(false)
        setGreeting("")
    }

    const handleExchSubmit = () => {
        const {tiles, bag} = tilesAndBag
        if (selectedTiles.size === 0) {
            return
        }
        //get the tiles to return to bag and covert them to the form {pos: p1, letter: J, points: 8} etc
        let toReturn = Array.from(selectedTiles)
        let tilesToReturn = []
        for (let id of toReturn) {
            tilesToReturn.push(tiles.filter((el) => el.pos === id)[0])
        }
        //get rid of the modal
        hideModalEx()
        setGreeting("Better Luck Next Time!")
        //get the tiles that would remain after deleting tilesTo Return
        let tilesRemoved = subtractArrays(tiles, tilesToReturn)

        //assign serial numbers to these tiles before adding them to the bag
        let srls = Array.from({ length: 100 }, (x, i) => i + 1)
        let usedSrls = bag.map((el) => el[0])
        let unusedSrls = subtractArrays(srls, usedSrls)

        let bagTiles = []
        for (let i = 0; i < tilesToReturn.length; i++) {
            bagTiles.push([
                unusedSrls[i],
                tilesToReturn[i].letter,
                tilesToReturn[i].points,
            ])
        }
        //this would be the state of the bag after adding the returned tiles to it
        let addToBag = [...bag, ...bagTiles]

        //now replenishing the array. Create a list of tiles to remove from the bag
        let removeFromBag = []
        let addToTiles = []
        let inds = getUniqueInts0(toReturn.length, bag.length)
        for (let i = 0; i < toReturn.length; i++) {
            removeFromBag.push(bag[inds[i]])
            addToTiles.push({
                pos: toReturn[i],
                letter: bag[inds[i]][1],
                points: parseInt(bag[inds[i]][2]),
                submitted: playersAndPoints[gameState.cp].level > 0,
            })
        }
        //update the states
        let newBag = subtractArrays(addToBag, removeFromBag)
        let newTiles = [...tilesRemoved, ...addToTiles]
        updateTilesAndBag(newTiles, newBag)
        const { cp: currentPlayer } = gameState
        setLastPlayed([
            {
                player: playersAndPoints[currentPlayer].name,
                word: "Exchanged",
                points: 0,
            },
            ...lastPlayed,
        ])
        advanceGameState()
    }
    /////////////////////////END EXCHANGE TILES MODAL///////////////////////////////////////


    //////START AI PLAY GROUP///////////////////////////////////////////

    //TODO: pass tilesAndBag through the AI group?

    const aiGetTiles = () => {
        const { cp: currentPlayer } = gameState
        const {tiles, bag} = tilesAndBag
        return new Promise((resolve, reject) => {
            let freeSlots = emptyOnRack(
                tiles,
                playersAndPoints[currentPlayer].rack
            )
            if (freeSlots.length === 0) {
                resolve(tiles)
                return
            }
            let removeFromBag = []
            let addToTiles = []
            let howManyToPick = Math.min(freeSlots.length, bag.length)
            let inds = getUniqueInts0(howManyToPick, bag.length)
            for (let i = 0; i < howManyToPick; i++) {
                removeFromBag.push(bag[inds[i]])
                addToTiles.push({
                    pos: freeSlots[i],
                    letter: bag[inds[i]][1],
                    points: parseInt(bag[inds[i]][2]),
                    submitted: playersAndPoints[currentPlayer].level > 0,
                })
            }
            let newBag = subtractArrays(bag, removeFromBag)
            let newTiles = [...tiles, ...addToTiles]
            updateTilesAndBag(newTiles, newBag)
            const tilesBagArr = [newTiles, newBag]
            resolve(tilesBagArr)
        })
    }

    const aiPlay = (tilesBagArr) => {
        if (tilesBagArr.length!==2){
            throw new Error("bag not sent with tiles")
        }
        const [theTiles] = tilesBagArr
        setShowAIThinking(true)
        const { cp: currentPlayer } = gameState
        let [p1, p2, p3, p4, p5, p6, p7] = makeRackPerms(
            theTiles,
            playersAndPoints[currentPlayer].rack
        )
        let makeVerslots = tilesOnBoard(theTiles).length !== 0 //no need to make vertical slots if the board is empty
        let [s1, s2, s3, s4, s5, s6, s7] = makeAllSlots(theTiles, makeVerslots)
        callAllWorkers([p1, p2, p3, p4, p5, p6, p7], [s1, s2, s3, s4, s5, s6, s7], theTiles, currentPlayer)
            .then((bestMove)=>aiSubmitMove(bestMove, tilesBagArr, currentPlayer))
        
    }





    function delay(t, v) {
        return new Promise(function (resolve) {
            setTimeout(resolve.bind(null, v), t)
        })
    }

    function callWorker(perms, slots, tiles, whichRack, cutoff, toWin, verbose=true) {
        return new Promise((resolve, reject) => {
            const myWorker = worker()
            setAiSays("")
            myWorker.addEventListener('message', (message) => {
                if (message.data.type!=="RPC"){
                    let result = message.data
                    if (typeof(result)==='string'){
                        setAiSays(message.data)
                    }
                    if (Array.isArray(result)){
                        setNumWorkersDone(x=>x+1)
                        resolve(result)
                        myWorker.terminate()
                    }
                }
              })

            myWorker.crunch(perms, slots, tiles, whichRack, cutoff, toWin, verbose)
        })
    }


    async function callWorkersSequentially(allPerms, allSlots, tiles, whichRack, cutoff, toWin) {
        setNumWorkersDone(0)
        let moves = []
        let bestMove = {points: -1}
        for (let i =0; i<7; i++){
            moves = await callWorker(allPerms[i], allSlots[i], tiles, whichRack, cutoff, toWin)
            if (moves.length===0){continue}
            moves.sort((x, y) => y.points - x.points)
            if (moves[0].points > bestMove.points){
                bestMove = moves[0]
            }
            if (bestMove.points >= toWin) {break}
        }
        return bestMove.points > -1 ? bestMove : []
    }

    async function callAllWorkers(allPerms, allSlots, tiles, currentPlayer) {
        setNumWorkersDone(0)
        let whichRack = playersAndPoints[currentPlayer].rack
        let cutoff = maxSearches[playersAndPoints[currentPlayer].level]
        let toWin = maxPoints - playersAndPoints[currentPlayer].points
        if (toWin<25){
            return callWorkersSequentially(allPerms, allSlots, tiles, whichRack, cutoff, toWin)
        }
        let promises = []
        for (let i=0;i<7;i++){
            promises.push(callWorker(allPerms[i], allSlots[i], tiles, whichRack, cutoff, toWin))
        }
        let moves = await Promise.all(promises)
        moves = moves.reduce((previousValue, currentValue) => [...previousValue, ...currentValue])
        if (moves.length===0){
            return []
        }
        moves.sort((x, y) => y.points - x.points)
        const bestMove = moves[0]
        return bestMove
    }

    const aiSubmitMove = (bestMove, tilesBagArr, currentPlayer) =>{
        setShowAIThinking(false)
        if (bestMove.length===0){
            console.log("No moves found")
            passTurn()
            return
        }
        const [theTiles, theBag] = tilesBagArr
        moveNPlay(bestMove, theTiles)
            .then((newTiles) => delay(1000, newTiles))
            .then((newTiles) => {
                return new Promise((resolve, reject) => {
                    let tpns = tilesPlayedNotSubmitted(newTiles)
                    let newWords = getAllNewWords(newTiles)
                    let aiScore = score(
                        newTiles,
                        playersAndPoints[currentPlayer].rack
                    )
                    let playersAndPointsCopy = Array.from(playersAndPoints)
                    playersAndPointsCopy[currentPlayer].points += aiScore
                    setPlayersAndPoints(playersAndPointsCopy)
                    setLastPlayed([
                        {
                            player: playersAndPoints[currentPlayer].name,
                            word: readWord(pickDisplayWord(newWords, tpns), newTiles),
                            points: aiScore,
                        },
                        ...lastPlayed,
                    ])
                    //Change the subitted field to true

                    let tilesNowSubmitted = []
                    for (let tile of tpns) {
                        tile.submitted = true
                        tilesNowSubmitted.push(tile)
                    }
                    resolve([
                        ...subtractArrays(newTiles, tpns),
                        ...tilesNowSubmitted,
                    ])
                })
            })
            .then((newTiles) => {
                updateTilesAndBag(newTiles, theBag)
                advanceGameState()
            })

    }

    const moveNPlay = (bestMove, theTiles) => {
        return new Promise((resolve, reject) => {
            let starts = bestMove.rackPerm
            let ends = bestMove.slot
            let letter = bestMove.letter
            let newTiles = aiMove(starts, ends, letter, theTiles)
            updateTiles(newTiles)
            resolve(newTiles)
        })
    }
  


    //////END AI PLAY GROUP/////////////////////////////////////////

    const shuffleRack = () => {
        const {tiles} = tilesAndBag
        const { cp: currentPlayer } = gameState
        updateTiles(shuffleRackTiles(tiles, playersAndPoints[currentPlayer].rack))
    }
    const recall = () => {
        const { cp: currentPlayer } = gameState
        const {tiles} = tilesAndBag
        updateTiles(recallTiles(tiles, playersAndPoints[currentPlayer].rack))
    }

    const passTurn = () =>{
        const { cp: currentPlayer } = gameState
        setLastPlayed([
            {
                player: playersAndPoints[currentPlayer].name,
                word: "Passed",
                points: 0,
            },
            ...lastPlayed,
        ])
        setGreeting("Uh Oh!")
        advanceGameState()
    }

    const passTurnWithWarning = () => {
        Swal.fire({
            title: 'Are you sure you want to pass your turn?',
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Pass',
            denyButtonText: `Don't pass`,
          }).then((result) => {
            if (result.isConfirmed) {
                passTurn()
            } else if (result.isDenied) {
              return
            }
          })
    }

    const lookup = () => {
        setShowDict(true)
    }

    const hideModal = () => {
        setShowDict(false)
    }

    const hideModalVictory = () => {
        setShowVictoryBox((x) => false)
    }

    const play = () => {
        const { cp: currentPlayer } = gameState
        const {tiles} = tilesAndBag
        let tpns = tilesPlayedNotSubmitted(tiles)
        if (tpns.length === 0) {
            return
        }

        if (!checkLegalPlacement(tiles, dictChecking, true)) {
            return
        }
        let newWords = getAllNewWords(tiles)

        setPlayersAndPoints((x) => {
            let playersAndPointsCopy = Array.from(x)
            playersAndPointsCopy[currentPlayer].points += pointsPossible
            return playersAndPointsCopy
        })
        setLastPlayed([
            {
                player: playersAndPoints[currentPlayer].name,
                word: readWord(pickDisplayWord(newWords, tpns), tiles),
                points: pointsPossible,
            },
            ...lastPlayed,
        ])
        //Change the subitted field to true

        let tilesNowSubmitted = []
        for (let tile of tpns) {
            tile.submitted = true
            tilesNowSubmitted.push(tile)
        }
        updateTiles([...subtractArrays(tiles, tpns), ...tilesNowSubmitted])
        let tr = tilesOnRack(tiles, playersAndPoints[currentPlayer].rack)
        if (tr.length === 0) {
            Swal.fire({
                icon: "success",
                title: "All Tiles Used!!!",
                text: "Great Job!!",
            })

        }

        advanceGameState()
    }

    

    const replenishRack = () => {
        const { cp: currentPlayer } = gameState
        const {tiles, bag} = tilesAndBag
        let freeSlots = emptyOnRack(tiles, playersAndPoints[currentPlayer].rack)
        if (freeSlots.length === 0) {
            return
        }
        let removeFromBag = []
        let addToTiles = []
        let howManyToPick = Math.min(freeSlots.length, bag.length)
        let inds = getUniqueInts0(howManyToPick, bag.length)
        for (let i = 0; i < howManyToPick; i++) {
            removeFromBag.push(bag[inds[i]])
            addToTiles.push({
                pos: freeSlots[i],
                letter: bag[inds[i]][1],
                points: parseInt(bag[inds[i]][2]),
                submitted: playersAndPoints[currentPlayer].level > 0,
            })
        }
        let newBag = subtractArrays(bag, removeFromBag)
        let newTiles = [...tiles, ...addToTiles]
        updateTilesAndBag(newTiles, newBag)
    }

    const theWinner = () => {
        let playerArray = Array.from(playersAndPoints)
        playerArray.sort((x, y) => y.points - x.points)
        return playerArray[0].name
    }

    const hideInstructions = () =>{
        setShowInstr(false)
    }

    const showInstructions = () =>{
        setShowInstr(true)
    }


    return (
        <>  
            <Instructions
                show={showInstr}
                onHide = {hideInstructions}
                playInstr = {true}
            />
            <VictoryModal
                show={showVictoryBox}
                winner={theWinner()}
                onClickClose={hideModalVictory}
            />
            <PassDeviceMessageModal
                show={showPassDevice}
                onHide={hideModalPassDevice}
                name={playersAndPoints[gameState.cp].name}
                greeting={greeting}
                playersAndPoints={playersAndPoints}
                lastPlayed = {lastPlayed}
            />
            <CheckDictionaryModal 
                show={showDict} 
                onHide={hideModal} 
                whichRack={playersAndPoints[gameState.cp].rack}
                tiles={tilesAndBag.tiles}
            />
            <ExchangeTilesModal
                show={showEx}
                onHide={hideModalEx}
                whichRack={playersAndPoints[gameState.cp].rack}
                tiles={tilesAndBag.tiles}
                clickHandlerExt={clickHandlerExt}
                handleSubmit={handleExchSubmit}
            />
            <AIThinkingModal show={showAIThinking} aiSays={aiSays} numWorkersDone = {numWorkersDone}/>
            <Container>
                <Row>
                    <Col sm={12} lg={7} md={12}>
                        <BoardAndRack
                            tiles={tilesAndBag.tiles}
                            visibleRack={playersAndPoints[gameState.cp].rack}
                            updateTiles={updateTiles}
                            showTiles={gameIsOver? false : !showPassDevice}></BoardAndRack>
                    </Col>
                    <Col sm={12} lg={2} md={12}>
                        <ControlButtons
                            shuffleRack={shuffleRack}
                            recall={recall}
                            exchange={exchange}
                            passTurn={passTurnWithWarning}
                            lookup={lookup}
                            play={play}
                            disabled={buttonsDisabled}
                        />
                    </Col>
                    <Col sm={12} lg={3} md={12}>
                        <ScoreKeeper
                            pointsPossible={pointsPossible}
                            playersAndPoints={playersAndPoints}
                            currentPlayer={gameState.cp}
                            tilesLeft={tilesAndBag.bag.length}
                            maxPoints={maxPoints}
                            lastPlayed={lastPlayed}
                            exitGame={exitGame}
                            showInstructions = {showInstructions}
                            dictChecking={dictChecking}
                            gameIsOver={gameIsOver}
                        />
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Game
