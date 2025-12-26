import React from "react"
import { Button } from "react-bootstrap"
import ButtonContent from "../UI/ButtonContent/ButtonContent"
import styles from "./ControlButtons.module.css"



const ControlButtons = ({shuffleRack, recall, exchange, passTurn, lookup, play, disabled}) => {
    return (
        <div className={`d-flex flex-column ${styles["horz-btns"]}`}>
            <div  className="p-2 mt-0">
                <Button className={styles.stretch} variant="primary" onClick={shuffleRack} disabled={disabled}>
                    <ButtonContent text={"Shuffle"}/>
                </Button>
            </div>
            <div className="p-2 mt-0">
                <Button className={styles.stretch} variant="primary" onClick={recall} disabled={disabled}>
                    <ButtonContent text={"Recall"}/>
                </Button>
            </div>
            <div className="p-2 mt-0">
                <Button className={styles.stretch} variant="primary" onClick={exchange} disabled={disabled}>
                    <ButtonContent text={"Exch"}/>
                </Button>
            </div>
            <div className="p-2 mt-0">
                <Button className={styles.stretch} variant="warning" onClick={passTurn} disabled={disabled}>
                    <ButtonContent text={"Pass"}/> 
                </Button>
            </div>
            <div className="p-2 mt-0">
                <Button className={styles.stretch} variant="info" onClick={lookup}>
                    <ButtonContent text={"Dict"}/>
                </Button>
            </div>
            <div className="p-2 mt-0">
                <Button className={styles.stretch} variant="success" onClick={play} disabled={disabled}>
                <ButtonContent text={"Play"}/>
                </Button>
            </div>
        </div>
    )
}

export default ControlButtons
