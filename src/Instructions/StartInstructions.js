import React from "react";
import styles from "./Instructions.module.css"

const StartInstructions = () => {
    return(
        <div>
          In this Scrabble game you always have access  to the Scrabble Dictionary. Feel free to use it to come up with the best words you can find!
              <ul>
                <li>Clicking <span className={styles.infobox}>Add Human</span> adds a human player</li>
                <li>Clicking <span className={styles.infobox}>Add Computer</span> adds a Artificial Intelligence player.</li>
                <li>Select the strength of each AI player (stronger = more thinking time)</li>
                <li>Enable/Disable dictionary checking. If dictionary checking is on, each submitted word will be checked against the official Scrabble dictionary</li>
                <li>Choose the how the game should end.</li>
                <li>Press <span className={styles.infobox}>Start Game</span> to begin the game.</li>
              </ul>
        </div>
    )
}

export default StartInstructions