import React from "react"
import styles from "./RackSquare.module.css"

const RackSquare = ({children, showTiles}) => {


    return (
        showTiles? <div className={styles.racksquare}>
            {children}
        </div>: null
    )

}

export default RackSquare