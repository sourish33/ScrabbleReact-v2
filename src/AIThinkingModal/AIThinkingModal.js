import Modal from "react-bootstrap/Modal"
import styles from './AIThinkingModal.module.css'
import { ProgressBar, Spinner } from "react-bootstrap"
import Rack from "../Rack/Rack"
import { useState, useEffect, useMemo } from "react"

const AIThinkingModal = ({show, aiSays, numWorkersDone, aiRack, aiName, tiles, tilesToRemove, onAnimationComplete}) => {
    const [removedTiles, setRemovedTiles] = useState([])

    // Reset animation state when modal is shown/hidden or when new tiles to remove are provided
    useEffect(() => {
        if (!show || !tilesToRemove || tilesToRemove.length === 0) {
            setRemovedTiles([])
        }
    }, [show, tilesToRemove])

    // Start animation when tilesToRemove is provided
    useEffect(() => {
        if (!tilesToRemove || tilesToRemove.length === 0) return

        // Wait 500ms before starting tile removal
        const initialDelay = setTimeout(() => {
            // Remove tiles one by one with 300ms delay between each
            let currentIndex = 0
            const interval = setInterval(() => {
                if (currentIndex < tilesToRemove.length) {
                    setRemovedTiles(prev => [...prev, tilesToRemove[currentIndex]])
                    currentIndex++
                } else {
                    clearInterval(interval)
                    // Wait a bit then notify parent to close modal
                    setTimeout(() => {
                        if (onAnimationComplete) {
                            onAnimationComplete()
                        }
                    }, 300)
                }
            }, 300)

            return () => clearInterval(interval)
        }, 500)

        return () => clearTimeout(initialDelay)
    }, [tilesToRemove, onAnimationComplete])

    // Filter tiles to hide removed ones
    const displayTiles = useMemo(() => {
        if (!tiles || removedTiles.length === 0) return tiles
        return tiles.filter(tile => !removedTiles.includes(tile.pos))
    }, [tiles, removedTiles])

    let now = Math.round(100*numWorkersDone/7)

    let aiUbach = aiSays==="" ? "AI thinking..." : aiSays
    return (
        <Modal show={show}>
            <Modal.Body className={styles.modalbody}>
                {/* AI's Rack */}
                {aiRack && displayTiles && (
                    <>
                        <div className={styles.rackLabel}>
                            {aiName}'s Tile Rack
                        </div>
                        <div className={styles.rackContainer}>
                            <Rack
                                whichRack={aiRack}
                                tiles={displayTiles}
                                showTiles={true}
                                DragStart={null}
                                DragOver={null}
                                Drop={null}
                                TouchStart={null}
                                TouchMove={null}
                                TouchEnd={null}
                            />
                        </div>
                    </>
                )}

                {/* Progress bar */}
                <div className="text-center">
                    {now===0 ? <Spinner animation="border" /> : <ProgressBar animated now={now} label={`${now}%`} style={{minWidth:'250px'}}/>}
                </div>

                {/* AI message */}
                <div className={styles.spinnertext}>{aiUbach}</div>
            </Modal.Body>
        </Modal>
    )
}

export default AIThinkingModal