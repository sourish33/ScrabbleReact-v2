import React from "react"
import styles from "./Square.module.css"

function Square({ bgd, children }) {
    //The bgd prop contains the marking on the square TW, DL, etc

    function decodeHTML(html) { //converts the &#9733 to a star
        var txt = document.createElement("textarea")
        txt.innerHTML = html
        return txt.value
    }
    //use the star if the marking is S

    const letter = bgd === "S" ? decodeHTML('&#9733') : bgd
    const mystar = <span className={bgd === "S" ? styles.star: null }>{letter}</span>

    const background = bgd ==="" ? 'plain' : bgd
    const squareBgd = `${styles[background]} ${styles[`full-height-width`]}`

    return (
        <div className={squareBgd}>
            {children}
            {mystar}
            {/* {children ? children : mystar} */}
        </div>
    )
}

Square.defaultProps = {
    bgd: ""
}

export default Square
