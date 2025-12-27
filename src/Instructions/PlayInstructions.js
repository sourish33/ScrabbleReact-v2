import React from "react";
import styles from "./Instructions.module.css"

const PlayInstructions = () => {
    return(
        <div>
            <div className={styles.tip}>
                <span className={styles.tipIcon}>💡</span>
                <strong>Pro Tip:</strong> Don't be limited by your vocabulary! Use the dictionary to discover new words and maximize your score.
            </div>

            <div className={styles.section}>
                <div className={styles.sectionTitle}>Game Basics</div>
                <ul>
                    <li>Drag and drop tiles with your mouse or touch to move them around</li>
                    <li>The current player's turn is shown in a <span className={styles.highlight}>highlighted</span> header at the top</li>
                    <li><span className={styles.infobox}>Points Possible</span> displays the points you could earn if your words are valid</li>
                </ul>
            </div>

            <div className={styles.section}>
                <div className={styles.sectionTitle}>Game Controls</div>
                <ul>
                    <li>
                        <span className={styles.infobox}>Shuffle</span> — Randomly rearrange the tiles in your rack (you can also drag them manually)
                    </li>
                    <li>
                        <span className={styles.infobox}>Recall</span> — Return all unsubmitted tiles from the board back to your rack
                    </li>
                    <li>
                        <span className={styles.infobox}>Exch</span> — Exchange some or all of your tiles for new ones (ends your turn)
                    </li>
                    <li>
                        <span className={styles.infobox}>Pass</span> — Skip your turn without playing or exchanging tiles
                    </li>
                    <li>
                        <span className={styles.infobox}>Dict</span> — Open the Scrabble dictionary and view a list of valid two-letter words
                    </li>
                    <li>
                        <span className={styles.infobox}>Play</span> — Submit your word(s) and score points
                    </li>
                </ul>
            </div>

            <div className={styles.section}>
                <div className={styles.sectionTitle}>Dictionary & Validity</div>
                <p>
                    All words played by the AI are guaranteed to be valid according to the{" "}
                    <a
                        href='https://www.collinsdictionary.com/us/scrabble/'
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#667eea', fontWeight: 600 }}
                    >
                        Collins Scrabble Dictionary
                    </a>.
                    When dictionary checking is enabled, your words will be validated against this same dictionary.
                </p>
            </div>

            <div className={styles.section}>
                <div className={styles.sectionTitle}>Saving Your Game</div>
                <ul>
                    <li><strong>Save & Exit:</strong> Save your current game and return to the welcome page (you can resume later)</li>
                    <li><strong>Exit:</strong> Leave the game without saving (progress will be lost)</li>
                </ul>
            </div>
        </div>
    )
}

export default PlayInstructions