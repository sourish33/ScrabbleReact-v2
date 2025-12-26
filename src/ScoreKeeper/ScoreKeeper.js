import React from "react"
import { useState } from "react"
import { Table, Button} from "react-bootstrap"
import Swal from "sweetalert2"
import ButtonContent from "../UI/ButtonContent/ButtonContent"
import { DefModal } from "./DefModal"
import styles from "./ScoreKeeper.module.css"

const gameType = (points) => {
    return points === 10000 ? "Till out of tiles" : `${points} point game`
}

const engLevels = {0: "", 1: "(Weak)", 2: "(Medium)", 3: "(Strong)"}//used to display the level of the AI

const scoreTable = (playersAndPoints, currentPlayer) => {
    return (
        <Table bordered className={styles.mytable}>
            <tbody>
                {playersAndPoints.map((el, ind) => {
                    return (
                        <tr
                            key={"row" + ind}
                            style={
                                ind === currentPlayer
                                    ? { background: "yellow" }
                                    : null
                            }>
                            <td>
                                <span className={styles.bold}>{`${el.name} ${engLevels[el.level]}`}</span>
                            </td>
                            <td>{el.points}</td>
                        </tr>
                    )
                })}
            </tbody>
        </Table>
    )
}

const TilesAndPoints = ({ tilesLeft, maxPoints, dictChecking }) => {
    const dc = dictChecking
        ? "Dictionary checking ON"
        : "Dictionary checking OFF"
    return (
        <div className={` ${styles["tpdiv"]}`}>
            <div className={styles.tpbox}>Tiles Left: {tilesLeft}</div>
            <div className={styles.tpbox}>{gameType(maxPoints)}</div>
            <div className={styles.tpbox}>{dc}</div>
        </div>
    )
}

const LastPlayed = ({ lastPlayed }) => {
    const [showDef, setShowDef] = useState(false);
    const [wordToCheck, setWordToCheck] = useState("")

    const handleClick = (word) =>{
        setShowDef(true)
        setWordToCheck(word)
    }

    
    if (lastPlayed.length > 10) {
        lastPlayed = lastPlayed.slice(0, 10)
    }
    return lastPlayed.length === 0 ? null : (
        <div className={styles.lastPlayed}>
            {lastPlayed.map((el, ind) => {
                return (
                    <p key={ind} className={styles.nomargin}>
                        <span>{el.player}</span>:{" "}
                        {el.word !== el.word.toUpperCase() ? (
                            <span className={styles.redbold}>{el.word}</span>
                        ) : (
                            <>
                            <span className={styles.fakeLink} onClick={() => {handleClick(el.word)}}>{el.word} </span> <span className={styles.bluebold}>for {el.points}
                            </span>
                            </>
                        )}
                    </p>
                )
            })}
            <DefModal show={showDef} setShow={setShowDef} word={wordToCheck}/>
        </div>
    )
}

const Buttons = ({ showInstructions, exitGame, saveAndExit }) => {
    return (
        <div className={`d-flex flex-column`}>
            <div className={`d-flex flex-row justify-content-center`}>
                <div className="p-2 mt-0">
                    <Button variant="info" onClick={showInstructions}>
                        <ButtonContent text={"Instructions"}/>
                    </Button>
                </div>
                <div className="p-2 mt-0">
                    <Button variant="danger" onClick={exitGame}>
                        <ButtonContent text={"Exit"}/>
                    </Button>
                </div>
            </div>
            <div className={`d-flex flex-row justify-content-center`}>
                <div className="p-2 mt-0">
                    <Button variant="success" onClick={saveAndExit}>
                        <ButtonContent text={"Save & Exit"}/>
                    </Button>
                </div>
            </div>
        </div>
    )
}

const ScoreKeeper = (props) => {
    const exitWithWarning = (e) => {
        if (props.gameIsOver) {
            props.exitGame()
            return
        }
        Swal.fire({
            title: "Are you sure you want to quit?",
            text: "Your game will not be saved.",
            showCancelButton: true,
            confirmButtonText: "Quit",
            confirmButtonColor: '#d33',
        }).then((result) => {
            if (result.isConfirmed) {
                props.exitGame()
            } else {
            }
        })
    }

    const saveAndExitWithConfirmation = () => {
        if (props.gameIsOver) {
            props.exitGame()
            return
        }
        Swal.fire({
            title: "Save game and exit?",
            text: "You can resume this game later from the main menu.",
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "Save & Exit",
            confirmButtonColor: '#28a745',
            cancelButtonText: "Cancel"
        }).then((result) => {
            if (result.isConfirmed) {
                props.saveAndExit()
            }
        })
    }

    return (
        <div className={`d-flex flex-column`}>
            <div
                className={`p-1 mb-2 justify-content-center ${styles["pointsOuterBox"]}`}>
                Points possible:{" "}
                <span className={styles.bold}>{props.pointsPossible}</span>
            </div>
            <div className="p-1 mb-2 justify-content-center">
                {scoreTable(props.playersAndPoints, props.currentPlayer)}
            </div>
            <div className="p-1 mb-2 justify-content-center">
                <TilesAndPoints
                    tilesLeft={props.tilesLeft}
                    maxPoints={props.maxPoints}
                    dictChecking={props.dictChecking}
                />
            </div>
            <div className="p-1 mb-2 justify-content-center">
                <LastPlayed lastPlayed={props.lastPlayed} />
            </div>
            <div className="p-1 mb-2 justify-content-center">
                <Buttons
                    showInstructions={props.showInstructions}
                    exitGame={exitWithWarning}
                    saveAndExit={saveAndExitWithConfirmation}
                />
            </div>
            <div className="p-1 mb-2 justify-content-center">
                <p style={{textAlign:'center'}}><a href="https://forms.gle/4FfSmwEHkgjvYZK7A" target="_blank" rel="noopener noreferrer">Leave Feedback</a></p>
            </div>
        </div>
    )
}

export default ScoreKeeper
