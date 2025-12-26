import React from "react"
import styles from "./RackSquareEx.module.css"

const RackSquareEx = ({children}) => {

    return (
        <div className={`${styles.racksquare}` }>
            {children}
        </div>
    )

}

export default RackSquareEx