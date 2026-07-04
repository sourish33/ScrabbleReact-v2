import React from "react";
import styles from "./Instructions.module.css"

const StartInstructions = () => {
    return(
        <div>
          <div className={styles.tip}>
            <span className={styles.tipIcon}>💡</span>
            <strong>What makes this special?</strong> In Tortoise Scrabble, you always have access to the Scrabble Dictionary! Feel free to look up words and strategize to find the best plays.
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>Setting Up Your Game</div>
            <ul>
              <li>Click <span className={styles.infobox}>+ Add Human</span> to add a human player (you can add up to 2 players total)</li>
              <li>Click <span className={styles.infobox}>+ Add Computer</span> to add an AI opponent (maximum 1 AI player)</li>
              <li>For AI players, select their difficulty level:
                <ul>
                  <li><strong>Weak:</strong> Plays reasonable but imperfect moves — beatable but not trivial</li>
                  <li><strong>Medium:</strong> Plays fairly well with some randomness — balanced challenge (recommended)</li>
                  <li><strong>Strong:</strong> Plays very strong moves — harder to beat</li>
                  <li><strong>Genius:</strong> Considers every possible move exhaustively and always plays the best one</li>
                </ul>
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>Game Options</div>
            <ul>
              <li><strong>Shuffle Players:</strong> Randomize the turn order before starting</li>
              <li><strong>Dictionary Checking:</strong> When enabled, all played words are verified against the official Scrabble dictionary</li>
              <li><strong>Game Type:</strong> Choose how the game ends:
                <ul>
                  <li><strong>75 Point Game:</strong> Quick match, first to 75 points wins</li>
                  <li><strong>150 Point Game:</strong> Standard match, first to 150 points wins</li>
                  <li><strong>Till The Tiles Run Out:</strong> Play until all tiles are used</li>
                </ul>
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>What You'll See</div>
            <ul>
              <li>The board shows premium squares (triple word, double letter, etc.) color-coded</li>
              <li>Your rack is displayed at the bottom (desktop) or side (mobile)</li>
              <li>The scoreboard tracks each player's points and shows whose turn it is</li>
              <li>After the game ends, stats show the best word played, bingo count, and more</li>
            </ul>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>Ready to Play?</div>
            <p>Once you've configured your game, click the <span className={styles.infobox}>Start Game</span> button to begin!</p>
          </div>
        </div>
    )
}

export default StartInstructions