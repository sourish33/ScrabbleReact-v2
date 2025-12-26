import React, { useState } from "react"
import { Button, ButtonToolbar } from "react-bootstrap"
import Instructions from "../Instructions/Instructions"
import { AI_LIST } from "../Utils/Data"
import { randomUpTo, subtractArrays } from "../Utils/helpers"
import styles from "./GameInfo.module.css"


const GameInfo = ({ handleSubmit }) => {

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
        let currentAIs = players.filter((el)=>{
           return el.level>0
        })
        let currrentAInames = currentAIs.map(el=>el.name)
        let unusedAIs = subtractArrays(AI_LIST, currrentAInames)
        let newInput = { name: unusedAIs[randomUpTo(unusedAIs.length-1)], level: 1 }//pick a random AI name that hsnt been used
        setPlayers((x) => {
            return [...x, newInput]
        })
    }

    const remove = () => {
        setPlayers((x) => {
            return x.slice(0, -1)
        })
    }

    const playerform = players.map((el, ind) => {
        let u =
            el.level === 0 ? (
                <div key={ind} className="row mb-3">
                    <div className="col-lg-6 col-sm-12 col-md-6">
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
                </div>
            ) : (
                <div key={ind} className="row mb-3">
                    <div className="col-6">
                        <input value={el.name} type="text" className="form-control" disabled />
                    </div>
                    <div className={`col-3`}>
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
                {players.length>0 ? 
                <div className={`${styles.card} ${styles.shadow2} col-lg-6 col-sm-12 col-md-12`}>
                    {playerform}
                </div> : null }
                <ButtonToolbar aria-label="Toolbar with button groups">
                    {players.length < 4 ? (
                        <Button variant="primary" type="button" className={'me-2'} onClick={handleClickHuman}>
                            Add Human
                        </Button>
                    ) : null}
                    {players.length < 4 ? (
                        <Button variant="primary" type="button" className={'me-2'} onClick={handleClickAI}>
                            Add Computer
                        </Button>
                    ) : null}

                    {players.length !== 0 ? (
                        <Button variant="primary" type="button" className={'me-2'} onClick={remove}>
                            Remove
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
