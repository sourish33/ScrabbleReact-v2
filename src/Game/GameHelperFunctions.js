import Swal from "sweetalert2"
import { DLs, DWs, S, TLs, TWs } from "../Board/BoardMarkings"
import { checkDict } from "../Utils/Dictionary/dictionary"
import {
    addLeftAll,
    addRightAll,
    anyCommonElements,
    coords,
    coordsTolocWordArr,
    getConsecutivesNums,
    getUniques,
    intersection,
    loc,
    neighbors,
    range,
    shuffle,
    subtractArrays,
} from "../Utils/helpers"

export const contains = (position, tiles) => {
    let u = tiles.filter((el) => el.pos === position)[0]
    return u ? true : false
}

export const readLetter = (position, tiles) => {
    if (!(typeof position === "string" || Array.isArray(position))) {
        throw new Error(`${position} not string or array`)
    }
    if (Array.isArray(position)) {
        if (position.length === 0) {
            throw new Error(`${position} empty array given to readLetter`)
        }
        position = "b" + loc(position[0], position[1])
    }
    if (!contains(position, tiles)) {
        throw new Error(`${position} not included in tiles`)
    }
    let slot = tiles.filter((el) => el.pos === position)[0]
    return slot.letter
}

export function readWord(letterArr, tiles) {
    let word = []
    for (let letter of letterArr) {
        word.push(readLetter(letter, tiles))
    }
    return word.join("")
}

export function readAllWords(wordArr, tiles) {
    return wordArr.map((el) => readWord(el, tiles))
}

export const readPoints = (position, tiles) => {
    if (!(typeof position === "string" || Array.isArray(position))) {
        throw new Error(`${position} not string or array`)
    }
    if (Array.isArray(position)) {
        if (position.length === 0) {
            throw new Error(`${position} empty array given to readPoints`)
        }
        position = "b" + loc(position[0], position[1])
    }
    if (!contains(position, tiles)) {
        throw new Error(`${position} not included in tiles`)
    }
    let slot = tiles.filter((el) => el.pos === position)[0]
    return slot.points
}

export const changeLetter = (position, newLetter, tiles) => {
    let slot = tiles.filter((el) => el.pos === position)[0]
    slot.letter = newLetter
    let slotRemoved = tiles.filter((el) => el.pos !== position)
    return [...slotRemoved, slot]
}

export const tilesOnRack = (tiles, rack) => {
    let rackTiles = tiles.filter((el) => {
        return el.pos[0] === rack
    })
    return rackTiles
}

export const tilesOnBoard = (tiles) => {
    let boardTiles = tiles.filter((el) => {
        return el.pos[0] === "b"
    })
    return boardTiles
}

export const tilesPlayedNotSubmitted = (tiles) => {
    let tilesPlayedNotSubmitted = tiles.filter((el) => {
        return el.pos[0] === "b" && !el.submitted
    })
    return tilesPlayedNotSubmitted
}

export const tilesSubmitted = (tiles) => {
    let tilesSubmitted = tiles.filter((el) => {
        return el.pos[0] === "b" && el.submitted
    })
    return tilesSubmitted
}

export const emptyOnRack = (tiles, rack) => {
    let rackTiles = tilesOnRack(tiles, rack)
    let occupiedSlots = rackTiles.map((el) => el.pos[1])
    let freeSlots = subtractArrays(
        ["1", "2", "3", "4", "5", "6", "7"],
        occupiedSlots
    )
    return freeSlots.map((el) => rack + el)
}

export const shuffleRackTiles = (tiles, rack) => {
    //Shuffles the tiles on the rack specified by rack

    //getting all the rack Tiles
    let rackTiles = tilesOnRack(tiles, rack)

    //getting the current positions of the tiles
    let occupiedSlots = rackTiles.map((el) => el.pos[1])
    //shuffling the positions
    let shuffledSlots = shuffle(occupiedSlots)

    //inserting the shuffled slots
    let shuffledTiles = rackTiles
    let N = rackTiles.length
    for (let i = 0; i < N; i++) {
        shuffledTiles[i].pos = rack + shuffledSlots[i]
    }
    //removing the original rack slots, inserting the new ones and returning
    return [...subtractArrays(tiles, rackTiles), ...shuffledTiles]
}

export const recallTiles = (tiles, rack) => {
    let unsubmittedTiles = tilesPlayedNotSubmitted(tiles)

    if (unsubmittedTiles.length === 0) {
        return tiles
    }
    //check for and handle blank tiles
    for (let tile of unsubmittedTiles) {
        if (tile.points === 0) {
            tile.letter = "_"
        }
    }

    let rackTiles = tilesOnRack(tiles, rack)

    if (rackTiles.length === 7) {
        throw new Error("all slots occupied on rack - cannot recall")
    }

    let freeSlots = emptyOnRack(tiles, rack)
    if (freeSlots.length !== unsubmittedTiles.length) {
        throw new Error(
            "number of tiles on board doesnt match number of empty spots  on rack"
        )
    }
    //making a copy of boardtiles to for changing positions to the free positions on the rack
    let returnedTiles = unsubmittedTiles
    for (let n = 0; n < unsubmittedTiles.length; n++) {
        returnedTiles[n].pos = freeSlots[n]
    }

    return [...subtractArrays(tiles, unsubmittedTiles), ...returnedTiles]
}

export function getAllWords(tiles) {
    let tb = tilesOnBoard(tiles)
    let boardnums = tb.map((el) => parseInt(el.pos.substring(1)))
    let xys = boardnums.map((el) => coords(el))
    let ys = getUniques(xys.map((el) => el[0]))
    let xs = getUniques(xys.map((el) => el[1]))

    let verwords = []
    for (let n of xs) {
        let lettersInThisCol = xys.filter((el) => el[1] === n)
        let ysInThisCol = lettersInThisCol.map((el) => el[0])
        let groups = getConsecutivesNums(ysInThisCol)
        let words = addRightAll(n, groups)
        verwords.push(words)
    }
    verwords = verwords.flat()

    let horwords = []
    for (let n of ys) {
        let lettersInThisRow = xys.filter((el) => el[0] === n)
        let xsInThisRow = lettersInThisRow.map((el) => el[1])
        let groups = getConsecutivesNums(xsInThisRow)
        let words = addLeftAll(n, groups)
        horwords.push(words)
    }
    horwords = horwords.flat()
    return [...horwords, ...verwords]
}

export function getAllNewWords(tiles) {
    let tpns = tilesPlayedNotSubmitted(tiles)
    let tpnsLoc = tpns.map((el) => el.pos)
    let allWords = getAllWords(tiles)
    let allwordsLoc = coordsTolocWordArr(allWords)
    return allwordsLoc.filter((el) => anyCommonElements(el, tpnsLoc))
}

export function pickDisplayWord(newWords, tpns) {
    let tpnsPos = tpns.map((el)=>el.pos)
    if (newWords.length === 0) {
        throw new Error("pickDisplayWord called with empty array of words")
    }
    if (newWords.length === 1) {
        return newWords[0]
    }
    
    newWords.sort((a, b) => {//sort by most new letters
        return intersection(b, tpnsPos).length - intersection(a, tpnsPos).length
    })

    return newWords[0]
}

export function legalPositions(tiles) {
    let ts = tilesSubmitted(tiles).map((el) => el.pos)
    if (ts.length === 0) {
        return ["b112"]
    }

    let allNeighbors = []
    for (let pos of ts) {
        allNeighbors = [...allNeighbors, ...neighbors(pos)]
    }

    return getUniques(subtractArrays(allNeighbors, ts))
}

function containsOneLegalPosition(word, tiles) {
    let lp = legalPositions(tiles)
    return anyCommonElements(word, lp)
}



export function gapWords(tiles) {
    let tpns = tilesPlayedNotSubmitted(tiles)
    let boardnums = tpns.map((el) => parseInt(el.pos.substring(1)))
    let xys = boardnums.map((el) => coords(el))
    let ys = getUniques(xys.map((el) => el[0])).sort()
    let xs = getUniques(xys.map((el) => el[1])).sort()

    if (xs.length > 1 && ys.length > 1) {
        return false
    }
    if (xs.length === 1) {
        let yrange = range(Math.min(...ys), Math.max(...ys) + 1)
        for (let y of yrange) {
            let posn = "b" + loc(y, xs[0]).toString()
            if (!contains(posn, tiles)) {
                return false
            }
        }
    }

    if (ys.length === 1) {
        let xrange = range(Math.min(...xs), Math.max(...xs))
        for (let x of xrange) {
            let posn = "b" + loc(ys[0], x).toString()
            if (!contains(posn, tiles)) {
                return false
            }
        }
    }

    return true
}

export function dictCheckWords(tiles){
    let wordlist = readAllWords(getAllNewWords(tiles), tiles)
    let badWords=wordlist.filter((el)=>!checkDict(el))
    return badWords
  }

export function checkLegalPlacement(tiles, dictChecking, verbose=false) {
    let newWords = getAllNewWords(tiles)
    if (!gapWords(tiles)) {
        if (verbose) {
        Swal.fire({
            icon: 'error',
            title: 'Tile Placement Illegal',
            text: 'All new tiles should be contiguous and in the same row or column ',
            footer: '<a href="https://scrabble.hasbro.com/en-us/rules">Scrabble Rules</a>'
          })
        }
        return false
    }
    if (newWords.length === 0) {
        return false
    }
    for (let word of newWords) {
        if (!containsOneLegalPosition(word, tiles)) {
            if (verbose) {
            Swal.fire({
                icon: 'error',
                title: 'Tile Placement Illegal',
                text: 'All new tiles should be contiguous and in the same row or column ',
                footer: '<a href="https://scrabble.hasbro.com/en-us/rules">Scrabble Rules</a>'
              })
            }
            return false
        }
    }

    if (dictChecking) {
        let badWords = dictCheckWords(tiles)
        if (badWords.length!==0) {
            const badWordsList = dictCheckWords(tiles).join(", ")
            Swal.fire({
                icon: 'error',
                title: 'Invalid Words',
                text: `${badWordsList} not valid`,
              })
            return false
        }
    }
    return true
}

function scoreWord(word, tiles){
    let sum =0
    let doublers = 0
    let triplers = 0
    let tpns = tilesPlayedNotSubmitted(tiles).map((el)=>el.pos)
    for (let l of word){
      let num = parseInt(l.substring(1))
      let points = readPoints(l, tiles)
      if (tpns.includes(l) ) {
        if (DLs.includes(num)) {
          sum += 2*points
        }
        else if (TLs.includes(num) ) {
          sum += 3*points
        }
        else if (DWs.includes(num) ) {
          sum += points
          doublers += 1
        }
        else if (S===num ){
          sum += points
          doublers += 1
        }
        else if (TWs.includes(num) ){
          sum += points
          triplers += 1
        }
        else {
          sum += points
        }
  
      }
      else {
        sum += points
      }
    }
    if (doublers>0) {
      sum = sum*2*doublers
    }
    if (triplers>0) {
      sum = sum*3*triplers
    }
    return sum
  }  
  
  export function score(tiles, visibleRack) {
    let newWords = getAllNewWords(tiles)
    let score = 0
    for (let word of newWords){
      score += scoreWord(word, tiles)
    }
    let tr = tilesOnRack(tiles, visibleRack)
    if (tr.length ===0) {
      score += 50 //bingo
    }
    return score
  }

  
export function rackPoints(rack, tiles) {
    //adds up the points for the tiles on the rack, "rack"
    let rackTiles=tiles.filter((el)=>el.pos[0]===rack)
    let totalPoints=0
    for (let tile of rackTiles){
      totalPoints += tile.points
    }
    return totalPoints
}


