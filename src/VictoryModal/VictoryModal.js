import React from "react"
import { Image } from "react-bootstrap"
import { shuffle } from "../Utils/helpers"
// import victory1 from "../Assets/Images/victory1.gif"
import styles from "./VictoryModal.module.css"

import dino1 from "../Assets/Images/dancingdino.gif"
import dino2 from "../Assets/Images/dinoscream.gif"
import dino3 from "../Assets/Images/dinodance.gif"
import dino4 from "../Assets/Images/dinosaur-roar.gif"
import dino5 from "../Assets/Images/dinosaur-dance1.gif"

const GameStats = ({ lastPlayed }) => {
    //pass/exchange entries use mixed-case words ("Passed"/"Exchanged");
    //real plays are recorded in upper case
    const plays = lastPlayed.filter((el) => el.word === el.word.toUpperCase())
    if (plays.length === 0) {
        return null
    }
    const bestPlay = plays.reduce((best, el) =>
        el.points > best.points ? el : best
    )
    const bingos = plays.filter((el) => el.bingo)
    return (
        <div className={styles.stats}>
            <p className={styles.statLine}>
                Best play: <b>{bestPlay.word}</b> for {bestPlay.points} points (
                {bestPlay.player})
            </p>
            <p className={styles.statLine}>
                Bingos: <b>{bingos.length}</b>
                {bingos.length > 0 &&
                    ` (${bingos.map((el) => `${el.word} by ${el.player}`).join(", ")})`}
            </p>
            <p className={styles.statLine}>
                Turns played: <b>{lastPlayed.length}</b>
            </p>
        </div>
    )
}

const VictoryModal = ({ show, winner, onClickClose, lastPlayed = [] }) => {
    const images = [
        dino1,
        dino2,
        dino3,
        dino4,
        dino5
    ]
    const shuffledImages = shuffle(images)

    return (
        <>
            {show && (
                <div className={styles.victorybox}>
                    <div>
                        <span className={styles.close} onClick={onClickClose}>
                            &times;
                        </span>
                    </div>
                    <div className={styles.victory}>
                        <h1>
                            <span>{winner}</span> has won!!!
                        </h1>
                    </div>
                    <GameStats lastPlayed={lastPlayed} />
                    <div style={{ width: "100%", height: "100%" }}>
                        <Image
                            src={shuffledImages[0]}
                            fluid
                            alt="nope"
                            style={{ width: "100%", height: "100%" }}
                        />
                    </div>
                </div>
            )}
        </>
    )
}

export default VictoryModal
