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

const VictoryModal = ({ show, winner, onClickClose }) => {
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
