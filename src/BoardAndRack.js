import React  from "react"
import Board from "./Board/Board"
import styles from "./BoardAndRack.module.css"

import move from "./Utils/movers"
import {
    getSquareIdFromPos,
    getXY,
    setTranslate,
} from "./Utils/dragndropHelpers"
import Rack from "./Rack/Rack"

const BoardAndRack = ({ tiles, visibleRack, updateTiles, showTiles }) => {
    

    let startingloc = ""
    let endingloc = ""
    let initialX
    let initialY
    let xOffset = 0
    let yOffset = 0
    let lastMoved=null
    let currentX
    let currentY




    const DragStart = (event) => {
        let whereArtThou = event.target.parentElement.parentElement.id
        event.dataTransfer.setData("text/plain", whereArtThou)
    }

    const DragOver = (event) => {
        event.preventDefault()
    }

    const Drop = (event) => {
        event.preventDefault()
        let incoming = event.dataTransfer.getData("text")
        let u = event.currentTarget
        let dest = getSquareIdFromPos(getXY(u))
        let newTiles = move(incoming, dest, tiles)
        if (newTiles === null) {
            console.log("null newTiles")
            return
        }
        updateTiles(newTiles)
    }

    const TouchStart = (e) => {
        e.stopPropagation()
        disableScroll() 
        if (e.touches.length > 1) {
            enableScroll()
            return
        }
        //Multiple Touches
        let u = e.currentTarget
        initialX = e.touches[0].clientX - xOffset
        initialY = e.touches[0].clientY - yOffset
        startingloc = getSquareIdFromPos(getXY(u))
    }

    const TouchMove = (e) => {
        e.stopPropagation()
        if (e.touches.length > 1) {
            return
        } //Multiple Touches
        disableScroll()
        let dragItem = e.currentTarget
        lastMoved = dragItem

        currentX = e.touches[0].clientX - initialX
        currentY = e.touches[0].clientY - initialY

        xOffset = currentX
        yOffset = currentY

        setTranslate(currentX, currentY, dragItem)
    }

    function TouchEnd(e) {
        enableScroll()
        e.preventDefault()
        if (e.touches.length > 1) {
            return
        } //Multiple Touches
        initialX = currentX
        initialY = currentY
        let u = e.currentTarget
        endingloc = getSquareIdFromPos(getXY(u))
        xOffset = 0
        yOffset = 0

        let newTiles = move(startingloc, endingloc, tiles)
        if (newTiles === null) {
            if(lastMoved) {
                lastMoved.style.transform = "none"
            }
            console.log("null newTiles")
            return
        }
        lastMoved.style.transform = "none"
        updateTiles(newTiles)
        
        
    }

    function disableScroll() {
        document.body.classList.add(styles.noscroll)
        document.body.parentElement.classList.add(styles.noscroll)
        
    }
      
    function enableScroll() {
        document.body.classList.remove(styles.noscroll)
        document.body.parentElement.classList.remove(styles.noscroll)
    }




    return (
        <div className ={styles.center}>
            <Board
                tiles={tiles}
                DragStart={DragStart}
                DragOver={DragOver}
                Drop={Drop}
                TouchStart={TouchStart}
                TouchMove={TouchMove}
                TouchEnd={TouchEnd}
            />
            <Rack
                whichRack={visibleRack}
                tiles={tiles}
                DragStart={DragStart}
                DragOver={DragOver}
                Drop={Drop}
                TouchStart={TouchStart}
                TouchMove={TouchMove}
                TouchEnd={TouchEnd}
                showTiles={showTiles}
            />
        </div>
    )
}

export default BoardAndRack

