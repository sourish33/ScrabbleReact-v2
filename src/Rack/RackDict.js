import React from "react";
import styles from "./RackEx.module.css";
import RackSquareEx from "../RackSquare/RackSquareEx";
import TileDict from "../Tile/TileDict";
import { tilesOnRack, tilesPlayedNotSubmitted } from "../Game/GameHelperFunctions";

const RackDict = ({ whichRack, tiles }) => {

  const tr = tilesOnRack(tiles, whichRack)
  const tpns = tilesPlayedNotSubmitted(tiles)
  const currentUnPlayedTiles = [...tr, ...tpns]

  const squares = [];
  for (let i = 1; i < 8; i++) {
      // let tile = tiles.filter((el)=>{return el.pos === whichRack+i})[0]
      let tile = currentUnPlayedTiles[i-1]
    let piece = (
      <TileDict
        letter={tile ? tile.letter : null} //just in case tile is undefined
        points={tile ? tile.points : null}
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

export default RackDict;
