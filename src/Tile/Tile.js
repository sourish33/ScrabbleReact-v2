import React from 'react'
import styles from './Tile.module.css'

const Tile = (props) => {
    //the opposite of submitted is sent to this component from Board - could be refactored later
    let classes = styles['tile']
    if (props.boardTile) {
        classes = !props.submitted? `${styles['tile']} ${styles['submitted']}`: styles['tile']
    }


    return (
        <div draggable = {props.submitted} className={classes}                     
        onTouchStart = {props.submitted ? props.TouchStart : null}
        onTouchMove = {props.submitted ? props.TouchMove: null}
        onTouchEnd = {props.submitted ? props.TouchEnd: null}
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