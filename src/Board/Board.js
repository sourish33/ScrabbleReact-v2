import React from "react"
import Square from "../Square/Square"
import Tile from "../Tile/Tile"
import styles from "./Board.module.css"
import { TWs, DWs, DLs, TLs, S } from "./BoardMarkings"
import { arrayToMap } from "../Utils/helpers"

const renderSquare = (i, piece = null) => {
    let whichBgd = ""

    if (i === S) {
        whichBgd = "S"
    }
    if (TWs.includes(i)) {
        whichBgd = "TW"
    }
    if (DWs.includes(i)) {
        whichBgd = "DW"
    }
    if (TLs.includes(i)) {
        whichBgd = "TL"
    }
    if (DLs.includes(i)) {
        whichBgd = "DL"
    }

    return <Square bgd={whichBgd}>{piece}</Square>
}

const Board = ({ tiles, DragStart, DragOver, Drop, TouchStart, TouchMove, TouchEnd }) => {
    let tilesMap = arrayToMap(tiles)

    const squares = []
    for (let i = 0; i < 225; i++) {
        if (tilesMap.has("b"+i)) {
            let piece = (
                <Tile
                    letter={tilesMap.get("b"+i)[0]}
                    points={tilesMap.get("b"+i)[1]}
                    submitted={!tilesMap.get("b"+i)[2]}
                    TouchStart = {TouchStart}
                    TouchMove = {TouchMove}
                    TouchEnd = {TouchEnd}
                    DragStart={DragStart}
                    DragOver={DragOver}
                    Drop={Drop}
                    boardTile= {true}
                />
            )
            let thisSquare = (
                <div
                    key={i}
                    className={styles.wrappingSquare}
                    id={"b"+i}


                >
                    {renderSquare(i, piece)}
                </div>
            )
            squares.push(thisSquare)
        } else {
            let thisSquare = (
                <div
                    key={i}
                    className={styles.wrappingSquare}
                    id={"b"+i}
                    onDragOver={DragOver}
                    onDrop={Drop}
                >
                    {renderSquare(i)}
                </div>
            )
            squares.push(thisSquare)
        }
    }

    return (
    <div className={styles.aspectratio}>
        <div className={styles.innerwrapper}>
            <div className={styles.wrappingBoard} >{squares}</div>
        </div>
    </div>
    )
}

export default Board
