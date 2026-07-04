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
                    <li><strong>Click-to-place:</strong> Click a tile on your rack to select it (blue ring shows selection), then click a board square to place it. Click the selected tile again or press <kbd>Esc</kbd> to deselect. You can also drag and drop instead.</li>
                    <li>The current player's turn is shown in the scoreboard with a <span className={styles.highlight}>yellow highlight</span> and a ► arrow</li>
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
                <div className={styles.sectionTitle}>Blank Tiles</div>
                <ul>
                    <li>When you move a blank tile (worth 0 points) from your rack to the board, a letter-picker will appear</li>
                    <li>Choose the letter you want the blank to represent for this turn</li>
                    <li>Blank tiles display with a lighter appearance so you remember they're wildcards</li>
                </ul>
            </div>

            <div className={styles.section}>
                <div className={styles.sectionTitle}>Tile Tracker</div>
                <p>
                    The <span className={styles.infobox}>Tile Tracker</span> on the right shows how many of each letter remain unseen (in the bag or on opponents' racks). Click the button to expand/collapse. This is perfect for serious players who like to track what's still out there!
                </p>
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
                <div className={styles.sectionTitle}>How Games End</div>
                <ul>
                    <li><strong>Reach the point goal:</strong> First player to reach 75, 150, or the custom goal wins immediately</li>
                    <li><strong>Everyone passes twice:</strong> If all players pass twice in a row with no plays, the game ends. Each player loses the value of their remaining rack tiles.</li>
                    <li><strong>Bag runs out:</strong> When all tiles are drawn and one player empties their rack, they win and collect points from all other players' remaining tiles</li>
                    <li><strong>Bingo bonus:</strong> Playing all 7 of your rack tiles in a single turn earns a 50-point bonus!</li>
                </ul>
            </div>

            <div className={styles.section}>
                <div className={styles.sectionTitle}>Exchanging Tiles</div>
                <ul>
                    <li>Click <span className={styles.infobox}>Exch</span> to swap tiles: select any tiles from your rack and they will be replaced with random tiles from the bag</li>
                    <li><strong>Exchange requires at least 7 tiles remaining in the bag</strong> — if fewer tiles are left, you cannot exchange</li>
                    <li>Exchanging ends your turn with no points scored</li>
                </ul>
            </div>

            <div className={styles.section}>
                <div className={styles.sectionTitle}>Post-Game Stats</div>
                <p>
                    After the game ends, a summary appears showing the best word played, total bingos, and number of turns. Use this to review your play and the AI's highlights!
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