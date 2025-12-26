import React from "react";
import styles from "./Instructions.module.css"

const PlayInstructions = () => {
    return(
        <div>
            <p> Don't be limited by your vocabulary! Use the Scrabble dictionary to search for words!</p>
            <p>All words played by the AI are valid words according
                        to the <a href='https://www.collinsdictionary.com/us/scrabble/'>Collins Scrabble Dictionary</a>.</p>
                    <ul>
                        <li>Move tiles around either by mouse or touch.</li>
                        <li>
                            The player whose turn it is will be{" "}
                            <span className={styles.highlight}>highlighted</span>
                        </li>
                        <li>
                            The <span className={styles.infobox}>Shuffle</span> button
                            shuffles the tiles on the rack. You can also
                            manually rearrange the rack by dragging tiles.
                        </li>
                        <li>
                            The <span className={styles.infobox}>Recall</span> button sends
                            all the unsubmitted tiles on the board back to the
                            rack
                        </li>
                        <li>
                            The <span className={styles.infobox}>Exch</span> button
                            allows you to exchange some/all of your tiles (this
                            costs you your turn).
                        </li>
                        <li>
                            The <span className={styles.infobox}>Pass</span> button passes your turn.
                        </li>
                        <li>
                            The <span className={styles.infobox}>Dict</span> button brings
                            up a dictionary and a list of two-letter words.
                        </li>
                        <li>
                            The <span className={styles.infobox}>Play</span> button submits the
                            tiles on the board.
                        </li>
 
                        <li>
                            <span className={styles.infobox}>Points possible</span> shows
                            the points you could earn assuming your words are in
                            the dictionary
                        </li>



                    </ul>
                </div>
    )
}

export default PlayInstructions