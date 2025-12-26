import {
    tilesSubmitted,
    legalPositions,
    readWord,
    readAllWords,
    getAllNewWords,
    score,
} from "../Game/GameHelperFunctions"
import {
    anyCommonElements,
    coords,
    subtractArrays,
    getUniques,
    combinations,
    permute,
    b_loc,
    countBlanks,
    arrayToMap,
} from "../Utils/helpers"
import { DLs, DWs, TLs, TWs } from "../Board/BoardMarkings"
import { checkDict } from "../Utils/Dictionary/dictionary"

// Cache premium square arrays (computed once at module load)
const BOARD_TWS = TWs.map((el) => "b" + el)
const BOARD_DWS = DWs.map((el) => "b" + el)
const BOARD_TLS = TLs.map((el) => "b" + el)
const BOARD_DLS = DLs.map((el) => "b" + el)

// Letters ordered by Scrabble frequency for efficient blank tile evaluation
const LETTERS = Array.from("SAEOQUXBCDFGHIJKLMNPRTVWYZ")

function mapToArray(myMap) {
    let myArr = []
    for (const [key, value] of myMap) {
        let row = {
            letter: value[0],
            points: value[1],
            pos: key,
            submitted: value[2],
        }
        myArr.push(row)
    }
    return myArr
}

function getXsAndYs(letterArray) {
    let xs = []
    let ys = []
    for (let el of letterArray) {
        let n = parseInt(el.substring(1))
        let [y, x] = coords(n)
        ys.push(y)
        xs.push(x)
    }
    ys = getUniques(ys)
    xs = getUniques(xs)
    return [xs, ys]
}

function makeVerSlots(x, n, legalPos, submittedTiles) {
    if (n > 15) {
        throw new Error(`${n} cannot be greater than 15 in makeVerSlots`)
    }
    let arr = []
    for (let i = 1; i < 15 - n + 2; i++) {
        let slot = []
        for (let j = i; j < n + i; j++) {
            slot.push(b_loc([j, x]))
        }
        slot = slot.filter((el) => !submittedTiles.includes(el))
        if (slot.length === 0 || slot.length === 1 || slot.length > 7) {
            continue
        }
        if (anyCommonElements(slot, legalPos)) {
            arr.push(slot)
        }
    }
    return arr
}

function prioritySort(slotArray) {
    let TWslots = slotArray.filter((el) => anyCommonElements(el, BOARD_TWS))
    slotArray = subtractArrays(slotArray, TWslots)
    let DWslots = slotArray.filter((el) => anyCommonElements(el, BOARD_DWS))
    slotArray = subtractArrays(slotArray, DWslots)
    let TLslots = slotArray.filter((el) => anyCommonElements(el, BOARD_TLS))
    slotArray = subtractArrays(slotArray, TLslots)
    let DLslots = slotArray.filter((el) => anyCommonElements(el, BOARD_DLS))
    slotArray = subtractArrays(slotArray, DLslots)
    return [...TWslots, ...DWslots, ...TLslots, ...DLslots, ...slotArray]
}

function makeHorSlots(y, n, legalPos, submittedTiles) {
    //y is the y-coord and n is the length of a window, legalPos are the legal positions and submittedTiles are the submitted Tiles
    //returns an array of all possible slots of lengt
    if (n > 15) {
        throw new Error(`${n} cannot be greater than 15 in makeHorSlots`)
    }
    let arr = []
    for (let i = 1; i < 15 - n + 2; i++) {
        let slot = []
        for (let j = i; j < n + i; j++) {
            slot.push(b_loc([y, j]))
        }
        slot = slot.filter((el) => !submittedTiles.includes(el))
        if (slot.length === 0 || slot.length === 1 || slot.length > 7) {
            continue
        }
        if (anyCommonElements(slot, legalPos)) {
            arr.push(slot)
        }
    }
    return arr
}

function makeAllHorSlots(tiles, lp, sub) {
    const arrMap = new Map()
    let [, ys] = getXsAndYs(lp)
    if (ys.length === 0) {
        return []
    }
    for (let y of ys) {
        for (let n = 2; n < 15; n++) {
            let slots = makeHorSlots(y, n, lp, sub)
            for (let slot of slots) {
                // Slots are already in order from makeHorSlots, no need to sort
                let str = JSON.stringify(slot)
                if (!arrMap.has(str)) {
                    arrMap.set(str, slot)
                }
            }
        }
    }
    return [...arrMap.values()]
}

function makeAllVerSlots(tiles, lp, sub) {
    const arrMap = new Map()
    let [xs] = getXsAndYs(lp)
    if (xs.length === 0) {
        return []
    }
    for (let x of xs) {
        for (let n = 2; n < 15; n++) {
            let slots = makeVerSlots(x, n, lp, sub)
            for (let slot of slots) {
                // Slots are already in order from makeVerSlots, no need to sort
                let str = JSON.stringify(slot)
                if (!arrMap.has(str)) {
                    arrMap.set(str, slot)
                }
            }
        }
    }
    return [...arrMap.values()]
}

export function makeAllSlots(tiles, verSlots = true) {
    let lp = legalPositions(tiles)
    let sub = tilesSubmitted(tiles).map((el) => el.pos)
    let allHorSlots = makeAllHorSlots(tiles, lp, sub)
    let allVerSlots = verSlots ? makeAllVerSlots(tiles, lp, sub) : []
    let allSlots = [...allHorSlots, ...allVerSlots]
    let s1 = lp.map((el) => [el])
    let s2 = allSlots.filter((el) => el.length === 2)
    let s3 = allSlots.filter((el) => el.length === 3)
    let s4 = allSlots.filter((el) => el.length === 4)
    let s5 = allSlots.filter((el) => el.length === 5)
    let s6 = allSlots.filter((el) => el.length === 6)
    let s7 = allSlots.filter((el) => el.length === 7)
    let bins = [s1, s2, s3, s4, s5, s6, s7]
    return bins.map((el) => prioritySort(el))
}

export function makeRackPerms(tiles, visibleRack) {
    let nums = Array.from({ length: 7 }, (x, i) => i + 1)
    let rackPos = nums.map((el) => visibleRack + el)
    let combs = combinations(rackPos)
    let perms = []
    for (let comb of combs) {
        perms = [...perms, ...permute(comb)]
    }
    let permsMap = new Map()
    for (let perm of perms) {
        let word = readWord(perm, tiles)
        if (!permsMap.has(word) && countBlanks(word) < 2) {
            //upto one blank tile
            permsMap.set(readWord(perm, tiles), perm)
        }
    }
    perms = Array.from(permsMap.values())
    let p1 = rackPos.map((el) => [el])
    let p2 = perms.filter((el) => el.length === 2)
    let p3 = perms.filter((el) => el.length === 3)
    let p4 = perms.filter((el) => el.length === 4)
    let p5 = perms.filter((el) => el.length === 5)
    let p6 = perms.filter((el) => el.length === 6)
    let p7 = perms.filter((el) => el.length === 7)
    return [p1, p2, p3, p4, p5, p6, p7]
}

function findBlankTile(rackTiles, tiles) {
    //returns index of tile containing blank and -1 if none found
    let rackLetters = readWord(rackTiles, tiles)
    return rackLetters.indexOf("_")
}

export function evaluateMoveBlank(
    rackTilesWithBlank,
    blankInd,
    boardPositions,
    tiles,
    visibleRack,
    letter
) {
    // rackTilesWithBlank: a group of rack tiles containing a blank tile
    // let blankInd = the index of the blank tile

    let blankpos = rackTilesWithBlank[blankInd]
    let tilesMap = arrayToMap(tiles)
    let blankTile = tilesMap.get(blankpos)
    // Create a copy to avoid mutating the original
    let blankTileCopy = [letter, blankTile[1], blankTile[2]]
    tilesMap.set(blankpos, blankTileCopy)
    let tilesCopy = mapToArray(tilesMap)

    return evaluateMove(
        rackTilesWithBlank,
        boardPositions,
        tilesCopy,
        visibleRack
    )
}

export function evaluateMove(rackTiles, boardPositions, tiles, visibleRack) {
    if (rackTiles.length !== boardPositions.length) {
        throw new Error(
            `${rackTiles} and ${boardPositions} unequal length in evaluateMove`
        )
    }
    let tilesCopyMap = arrayToMap(tiles)

    for (let i = 0; i < rackTiles.length; i++) {
        let st = rackTiles[i]
        let end = boardPositions[i]
        let val = tilesCopyMap.get(st)
        // Create a copy to avoid mutating the original
        let valCopy = [val[0], val[1], false]
        tilesCopyMap.set(end, valCopy)
        tilesCopyMap.delete(st)
    }
    let tilesCopy = mapToArray(tilesCopyMap)
    let nWords = readAllWords(getAllNewWords(tilesCopy), tilesCopy)
    let anyBadWords = nWords.some((el) => !checkDict(el))
    return anyBadWords ? null : score(tilesCopy, visibleRack)
}


export const evaluateMoves = (rackPerms, slots, tiles, rack, cutoff = 50000, toWin = 1000) => {
    if (rackPerms.length===0){
        return []
    }

    let moves = []
    let tries = 0
    let triesBlank = 0
    let cutoffTriesBlank = 10000
    function search() {//made into a function so that loops can be broken out of using return
        for (let rp of rackPerms) {
            let blankInd = findBlankTile(rp, tiles)
            if (blankInd === -1) {
                for (let s of slots) {
                    if (tries > cutoff) {
                        return
                    }
                    let pts = evaluateMove(rp, s, tiles, rack)
                    if (pts) {
                        moves.push({
                            rackPerm: rp,
                            slot: s,
                            points: pts,
                            letter: "",
                        })
                    }
                    if (pts>=toWin) {
                        console.log(`need ${toWin} to win, found ${pts}`)
                        return
                    }
                    tries += 1
                }
            } else {
                for (let letter of LETTERS) {
                    for (let s of slots) {
                        if (triesBlank > cutoffTriesBlank) {
                            return
                        }
                        let pts = evaluateMoveBlank(
                            rp,
                            blankInd,
                            s,
                            tiles,
                            rack,
                            letter
                        )
                        if (pts) {
                            moves.push({
                                rackPerm: rp,
                                slot: s,
                                points: pts,
                                letter: letter,
                            })
                        }
                        if (pts>=toWin) {
                            console.log(`need ${toWin} to win, found ${pts}`)
                            return
                        }
                        triesBlank += 1
                    }
                }
            }
        }
    }
    search()
    return moves
}

export function aiMove(starts, ends, letter, tiles) {
    
    let tilesMap = arrayToMap(tiles)
    // console.log(tilesMap)
    for (let i=0; i<starts.length;i++) {
        let val = tilesMap.get(starts[i])
        if (val[0] === "_"){
            val[0] = letter
        }
        val[2] = false
        tilesMap.set(ends[i], val)
        tilesMap.delete(starts[i])
    }
    return  mapToArray(tilesMap)

}
