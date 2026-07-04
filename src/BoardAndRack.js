import React, { useEffect, useState } from "react"
import Board from "./Board/Board"
import styles from "./BoardAndRack.module.css"

import move from "./Utils/movers"
import {
    getSquareIdFromPos,
    getXY,
    setTranslate,
} from "./Utils/dragndropHelpers"
import { formcheck } from "./Utils/helpers"
import Rack from "./Rack/Rack"

const BoardAndRack = ({ tiles, visibleRack, updateTiles, showTiles, animatingTiles }) => {
    //click-to-place: pos of the currently selected tile ("p3", "b112", ...) or null
    const [selectedPos, setSelectedPos] = useState(null)


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

    const Drop = async (event) => {
        event.preventDefault()
        let incoming = event.dataTransfer.getData("text")
        let u = event.currentTarget
        let dest = getSquareIdFromPos(getXY(u))
        let newTiles = await move(incoming, dest, tiles)
        if (newTiles === null) {
            console.log("null newTiles")
            return
        }
        setSelectedPos(null)
        updateTiles(newTiles)
    }

    //returns true if the tile at pos can be picked up by the current (human) player
    const isMovable = (pos) => {
        const tile = tiles.find((el) => el.pos === pos)
        if (!tile) {
            return false
        }
        return pos[0] === "b" ? !tile.submitted : pos[0] === visibleRack
    }

    const handleClick = async (event) => {
        if (!showTiles) {
            return
        }
        const square = event.target.closest("[id]")
        if (!square || !formcheck(square.id)) {
            return
        }
        const pos = square.id
        if (selectedPos === null) {
            if (isMovable(pos)) {
                setSelectedPos(pos)
            }
            return
        }
        if (selectedPos === pos) {
            setSelectedPos(null)
            return
        }
        const newTiles = await move(selectedPos, pos, tiles)
        setSelectedPos(null)
        if (newTiles !== null) {
            updateTiles(newTiles)
        } else if (isMovable(pos)) {
            //invalid destination but a valid tile: switch the selection to it
            setSelectedPos(pos)
        }
    }

    useEffect(() => {
        const onKeyDown = (e) => {
            if (e.key === "Escape") {
                setSelectedPos(null)
            }
        }
        document.addEventListener("keydown", onKeyDown)
        return () => document.removeEventListener("keydown", onKeyDown)
    }, [])

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

        if (startingloc === endingloc) {
            //a tap rather than a drag: treat it like a click (select/deselect/place)
            if (lastMoved) {
                lastMoved.style.transform = "none"
            }
            if (selectedPos && selectedPos !== startingloc) {
                move(selectedPos, startingloc, tiles).then((newTiles) => {
                    setSelectedPos(null)
                    if (newTiles !== null) {
                        updateTiles(newTiles)
                    } else {
                        setSelectedPos(startingloc)
                    }
                })
                return
            }
            setSelectedPos((prev) => (prev === startingloc ? null : startingloc))
            return
        }
        move(startingloc, endingloc, tiles).then((newTiles) => {
            if (newTiles === null) {
                if(lastMoved) {
                    lastMoved.style.transform = "none"
                }
                console.log("null newTiles")
                return
            }
            lastMoved.style.transform = "none"
            setSelectedPos(null)
            updateTiles(newTiles)
        })
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
        <div className ={styles.center} onClick={handleClick}>
            <Board
                tiles={tiles}
                DragStart={DragStart}
                DragOver={DragOver}
                Drop={Drop}
                TouchStart={TouchStart}
                TouchMove={TouchMove}
                TouchEnd={TouchEnd}
                animatingTiles={animatingTiles}
                selectedPos={selectedPos}
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
                selectedPos={selectedPos}
            />
        </div>
    )
}

export default BoardAndRack

