import React, { useState } from "react"
import { Button, ButtonToolbar } from "react-bootstrap"
import Instructions from "../Instructions/Instructions"
import ResumeGameCard from "./ResumeGameCard"
import { AI_LIST } from "../Utils/Data"
import { randomUpTo, subtractArrays } from "../Utils/helpers"
import styles from "./GameInfo.module.css"

// Game configuration - adjust these values to change game limits
const MAX_PLAYERS = 2;        // Maximum total number of players (humans + AI)
const MAX_AI_PLAYERS = 1;     // Maximum number of AI players allowed
const DEFAULT_AI_LEVEL = 2;   // Default AI difficulty: 1=Weak, 2=Medium, 3=Strong

const GameInfo = ({ handleSubmit, hasSavedGame, savedPlayerNames, onResumeGame, onDiscardGame }) => {

    const [showInstr, setShowInstr] = useState(false)
    const [players, setPlayers] = useState([])
    const [shufflePlayers, setShufflePlayers] = useState("0")
    const [dictCheck, setDictCheck] = useState("1")
    const [gameType, setGameType] = useState("150")

    const handleChange = (event, index) => {
        let playerName = event.target.value
        let x = [...players]
        x[index]["name"] = playerName
        setPlayers(x)
    }

    const handleSelect = (event, index) => {
        let playerLevel = event.target.value
        let x = [...players]
        x[index]["level"] = playerLevel
        setPlayers(x)
    }

    const handleSelectShuffle = (event) => {
        setShufflePlayers(event.target.value)
    }

    const handleSelectDictCheck = (event) => {
        setDictCheck(event.target.value)
    }

    const handleSelectGameType = (event) => {
        setGameType(event.target.value)
    }

    const handleClickHuman = (event) => {
        let newInput = { name: "", level: 0 }
        setPlayers((x) => {
            return [...x, newInput]
        })
    }

    const handleClickAI = (event) => {
        // Count current AI players
        let currentAIs = players.filter((el)=>{
           return el.level>0
        })

        // Don't add if we've reached the AI limit
        if (currentAIs.length >= MAX_AI_PLAYERS) {
            return;
        }

        let currrentAInames = currentAIs.map(el=>el.name)
        let unusedAIs = subtractArrays(AI_LIST, currrentAInames)
        let newInput = { name: unusedAIs[randomUpTo(unusedAIs.length-1)], level: DEFAULT_AI_LEVEL }//pick a random AI name that hsnt been used
        setPlayers((x) => {
            return [...x, newInput]
        })
    }

    const remove = (index) => {
        setPlayers((x) => x.filter((_, i) => i !== index))
    }

    const playerform = players.map((el, ind) => {
        let u =
            el.level === 0 ? (
                <div key={ind} className="row mb-3 align-items-center">
                    <div className="col-lg-6 col-sm-10 col-md-6">
                    <input
                        name="Player Name"
                        className="form-control"
                        value={el.name}
                        type="text"
                        maxLength="16"
                        placeholder={`Player ${ind + 1} name`}
                        onChange={(e) => handleChange(e, ind)}
                    />
                    </div>
                    <div className="col-auto">
                        <span className={styles.deleteIcon} onClick={() => remove(ind)}>&#x1F5D1;</span>
                    </div>
                </div>
            ) : (
                <div key={ind} className="row mb-3 align-items-center">
                    <div className="col-5">
                        <input value={el.name} type="text" className="form-control" disabled />
                    </div>
                    <div className="col-3">
                        <select
                            className={styles.select}
                            name="level"
                            onChange={(e) => handleSelect(e, ind)}
                            value={el.level}
                        >
                            <option key="W" value="1">Weak</option>
                            <option key="M" value="2">Medium</option>
                            <option key="S" value="3">Strong</option>
                        </select>
                    </div>
                    <div className="col-auto">
                        <span className={styles.deleteIcon} onClick={() => remove(ind)}>&#x1F5D1;</span>
                    </div>
                </div>
            )

        return u
    })

    const ShouldShuffle = () => {
        return (
            <div className="row mb-3">
                <div className="col-6">Shuffle Players? </div>
                <div className="col-6">
                    <select
                        className={styles.select}
                        name="shuffle"
                        onChange={handleSelectShuffle}
                        value={shufflePlayers}
                    >
                        <option key="N" value="0">No</option>
                        <option key="Y" value="1">Yes</option>
                    </select>
                </div>
            </div>
        )
    }

    const ShouldCheckDict = () => {
        return (
            <div className="row mb-3">
                <div className="col-6">Dictionary Checking: </div>
                <div className="col-6">
                    <select
                        className={styles.select}
                        name="shuffle"
                        onChange={handleSelectDictCheck}
                        value={dictCheck}
                    >
                        <option key="on" value="1">On</option>
                        <option key="off" value="0">Off</option>
                    </select>
                </div>
            </div>
        )
    }

    const GameType = () => {
        return (
            <div className="row mb-3">
                <div className="col-6">Game Type: </div>
                <div className="col-6">
                    <select
                        className={styles.select}
                        name="shuffle"
                        onChange={handleSelectGameType}
                        value={gameType}
                    >
                        <option key="75" value="75">75 Point Game</option>
                        <option key="150" value="150">150 Point Game</option>
                        <option key="inf" value="10000">Till The Tiles Run Out</option>
                    </select>
                </div>
            </div>
        )
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
                playInstr = {false}
            />
        <div>
            <form className="row g-3"
                onSubmit={(e) =>
                    handleSubmit(
                        e,
                        players,
                        shufflePlayers,
                        dictCheck,
                        gameType
                    )
                }
            >
                {hasSavedGame && (
                    <ResumeGameCard
                        savedPlayerNames={savedPlayerNames}
                        onResumeGame={onResumeGame}
                        onDiscardGame={onDiscardGame}
                    />
                )}
                {players.length>0 ?
                <div className={`${styles.card} ${styles.shadow2} col-lg-6 col-sm-12 col-md-12`}>
                    {playerform}
                </div> : null }
                <ButtonToolbar aria-label="Toolbar with button groups">
                    {players.length < MAX_PLAYERS ? (
                        <Button variant="primary" type="button" className={'me-2'} onClick={handleClickHuman}>
                            Add Human
                        </Button>
                    ) : null}
                    {players.length < MAX_PLAYERS && players.filter(p => p.level > 0).length < MAX_AI_PLAYERS ? (
                        <Button variant="primary" type="button" className={'me-2'} onClick={handleClickAI}>
                            Add Computer
                        </Button>
                    ) : null}
                </ButtonToolbar>
                <div className={`${styles.card} ${styles.shadow2} col-lg-6 col-sm-12 col-md-12`}>
                <ShouldShuffle />
                <ShouldCheckDict />
                <GameType />
                </div>
                <div className="btn-toolbar">
                    <Button variant="primary" type="submit" className={'me-2'} >Start Game</Button>
                    <Button variant="info" type="button" onClick={showInstructions}>Instructions</Button>
                </div>
            </form>
        </div>
    </>
    )
}

export default GameInfo
