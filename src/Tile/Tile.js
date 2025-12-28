import React from 'react'
import styles from './Tile.module.css'

const Tile = (props) => {
    let classes = styles.tile
    let inlineStyle = {}

    if (props.boardTile) {
        const isSubmittedTile = !props.submitted

        if (props.isAnimating) {
            classes = `${styles.tile} ${styles.aiBounce}`
            inlineStyle = { animationDelay: `${props.animationDelay}ms` }
        } else if (isSubmittedTile) {
            classes = `${styles.tile} ${styles.submitted}`
        }
    }

    return (
        <div
            draggable={props.submitted}
            className={classes}
            style={inlineStyle}
            onTouchStart={props.submitted ? props.TouchStart : null}
            onTouchMove={props.submitted ? props.TouchMove: null}
            onTouchEnd={props.submitted ? props.TouchEnd: null}
            onDragStart={props.submitted ? props.DragStart: null}
            onDragOver={props.submitted ? props.DragOver: null}
            onDrop={props.submitted ? props.Drop: null}
        >
            <div className={props.boardTile? styles.letter: styles.letterOnRack}>{props.letter}</div>
            <div className={props.boardTile? styles.points: styles.pointsOnRack}>{props.points}</div>
        </div>

    )

}

export default Tile