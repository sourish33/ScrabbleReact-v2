import React, { useState } from "react"
import Bag from "../Utils/Bag"
import styles from "./TileTracker.module.css"

//how many of each letter the full game starts with, derived from the bag specs
const initialCounts = {}
for (const [, letter] of Bag) {
    initialCounts[letter] = (initialCounts[letter] || 0) + 1
}

const LETTER_ORDER = [...Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ"), "_"]

const TileTracker = ({ tiles, visibleRack }) => {
    const [open, setOpen] = useState(false)

    //unseen = everything except the board and the player's own rack
    //(i.e. what's still in the bag plus what's on opponents' racks)
    const counts = { ...initialCounts }
    let unseenTotal = Bag.length
    for (const tile of tiles) {
        const seen = tile.pos[0] === "b" || tile.pos[0] === visibleRack
        if (!seen) {
            continue
        }
        //a played blank shows a chosen letter but keeps 0 points: count it as a blank
        const letter = tile.points === 0 ? "_" : tile.letter
        counts[letter] -= 1
        unseenTotal -= 1
    }

    return (
        <div className={styles.tracker}>
            <button
                type="button"
                className={styles.toggle}
                onClick={() => setOpen((x) => !x)}
            >
                Tile Tracker ({unseenTotal} unseen) {open ? "▴" : "▾"}
            </button>
            {open && (
                <div className={styles.grid}>
                    {LETTER_ORDER.map((letter) => (
                        <div
                            key={letter}
                            className={
                                counts[letter] > 0
                                    ? styles.chip
                                    : `${styles.chip} ${styles.exhausted}`
                            }
                        >
                            <span className={styles.chipLetter}>{letter}</span>
                            <span className={styles.chipCount}>{counts[letter]}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default TileTracker
