import React from "react";
import styles from "./RackEx.module.css";
import TileEx from "../Tile/TileEx";
import RackSquareEx from "../RackSquare/RackSquareEx";

const RackEx = ({ whichRack, tiles, clickHandlerExt }) => {

  const squares = [];
  for (let i = 1; i < 8; i++) {
      let tile = tiles.filter((el)=>{return el.pos === whichRack+i})[0]
    let piece = (
      <TileEx
        letter={tile ? tile.letter : null} //just in case tile is undefined
        points={tile ? tile.points : null}
        clickHandlerExt = {clickHandlerExt}
      />
    );
    let thisSquare = (
      <div key={i} className={styles.wrappingSquare} id={"e" + i} >
        <RackSquareEx>{piece}</RackSquareEx>
      </div>
    );
    squares.push(thisSquare);
  }

  return (
    <div className={styles.aspectratio}>
      <div className={styles.innerwrapper}>
        <div className={styles.wrappingRack}>{squares}</div>
      </div>
    </div>
  );
};

export default RackEx;
