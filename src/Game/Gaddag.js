import { DLs, DWs, TLs, TWs, S } from "../Board/BoardMarkings"
import { checkDict } from "../Utils/Dictionary/dictionary"
import { tilesSubmitted, tilesOnRack } from "./GameHelperFunctions"

// A GADDAG-based move generator (Gordon, 1994). The GADDAG stores, for every
// word and every letter position i in it, the sequence REV(prefix)·SEP·suffix.
// Move generation walks the structure from each anchor square, extending
// leftward through reversed prefixes and rightward after the separator, so
// only letter sequences that can still lead to a dictionary word are ever
// explored. This finds every legal move without enumerating rack permutations.

const SEP = 26 // pseudo-letter used as the prefix/suffix separator
const CHARCODE_A = 65
const ALL_LETTERS_MASK = (1 << 26) - 1
const BOARD_SIZE = 15
const CENTER = S // b112

export function buildGaddag(words) {
    let cap = 1 << 20
    let chr = new Uint8Array(cap) // letter index (0-25, or SEP) on the arc into this node
    let firstChild = new Int32Array(cap) // 0 = no children (node 0 is the root, never a child)
    let nextSib = new Int32Array(cap)
    let term = new Uint8Array(cap) // 1 if a sequence ends at this node
    let n = 1

    function grow() {
        cap *= 2
        const c = new Uint8Array(cap)
        c.set(chr)
        chr = c
        const f = new Int32Array(cap)
        f.set(firstChild)
        firstChild = f
        const s = new Int32Array(cap)
        s.set(nextSib)
        nextSib = s
        const t = new Uint8Array(cap)
        t.set(term)
        term = t
    }

    const seq = new Uint8Array(2 * BOARD_SIZE + 1)
    for (const w of words) {
        const L = w.length
        for (let i = 1; i <= L; i++) {
            let p = 0
            for (let j = i - 1; j >= 0; j--) {
                seq[p++] = w.charCodeAt(j) - CHARCODE_A
            }
            if (i < L) {
                seq[p++] = SEP
                for (let j = i; j < L; j++) {
                    seq[p++] = w.charCodeAt(j) - CHARCODE_A
                }
            }
            let node = 0
            for (let k = 0; k < p; k++) {
                const c = seq[k]
                let child = firstChild[node]
                while (child !== 0 && chr[child] !== c) {
                    child = nextSib[child]
                }
                if (child === 0) {
                    if (n === cap) {
                        grow()
                    }
                    child = n++
                    chr[child] = c
                    nextSib[child] = firstChild[node]
                    firstChild[node] = child
                }
                node = child
            }
            term[node] = 1
        }
    }

    return {
        chr: chr.slice(0, n),
        firstChild: firstChild.slice(0, n),
        nextSib: nextSib.slice(0, n),
        term: term.slice(0, n),
        size: n,
    }
}

// Multiplier boards, built once. The center square counts as a double-word
// square, matching scoreWord in GameHelperFunctions.
const LETTER_MULT = new Uint8Array(225).fill(1)
const WORD_MULT = new Uint8Array(225).fill(1)
for (const sq of DLs) LETTER_MULT[sq] = 2
for (const sq of TLs) LETTER_MULT[sq] = 3
for (const sq of DWs) WORD_MULT[sq] = 2
for (const sq of TWs) WORD_MULT[sq] = 3
WORD_MULT[CENTER] = 2

// For each empty square, which letters form a valid perpendicular word
// (a bitmask), and the sum of the points of the perpendicular tiles.
function computeCrossChecks(boardLetter, boardPoints, crossStep) {
    const mask = new Int32Array(225).fill(ALL_LETTERS_MASK)
    const crossSum = new Int32Array(225)
    const hasCross = new Uint8Array(225)
    const vertical = crossStep === BOARD_SIZE
    for (let sq = 0; sq < 225; sq++) {
        if (boardLetter[sq] >= 0) {
            continue
        }
        const prevOk = vertical ? sq >= BOARD_SIZE : sq % BOARD_SIZE > 0
        const nextOk = vertical ? sq < 225 - BOARD_SIZE : sq % BOARD_SIZE < BOARD_SIZE - 1
        let before = ""
        let after = ""
        let sum = 0
        let k = sq - crossStep
        while (prevOk && k >= 0 && boardLetter[k] >= 0) {
            before = String.fromCharCode(CHARCODE_A + boardLetter[k]) + before
            sum += boardPoints[k]
            if (vertical ? k < BOARD_SIZE : k % BOARD_SIZE === 0) break
            k -= crossStep
        }
        k = sq + crossStep
        while (nextOk && k < 225 && boardLetter[k] >= 0) {
            after += String.fromCharCode(CHARCODE_A + boardLetter[k])
            sum += boardPoints[k]
            if (vertical ? k >= 225 - BOARD_SIZE : k % BOARD_SIZE === BOARD_SIZE - 1) break
            k += crossStep
        }
        if (before === "" && after === "") {
            continue
        }
        let m = 0
        for (let c = 0; c < 26; c++) {
            if (checkDict(before + String.fromCharCode(CHARCODE_A + c) + after)) {
                m |= 1 << c
            }
        }
        mask[sq] = m
        crossSum[sq] = sum
        hasCross[sq] = 1
    }
    return { mask, crossSum, hasCross }
}

// Generates every legal move for the given rack. Returns moves in the shape
// the rest of the game expects: {rackPerm, slot, points, letter}, sorted by
// points descending. Like the brute-force AI, at most one blank is used per
// move (aiMove can only assign a single letter to blanks).
export function generateAllMoves(gaddag, tiles, rackName) {
    const { chr, firstChild, nextSib, term } = gaddag

    const boardLetter = new Int8Array(225).fill(-1)
    const boardPoints = new Int32Array(225)
    for (const t of tilesSubmitted(tiles)) {
        const sq = parseInt(t.pos.substring(1))
        boardLetter[sq] = t.letter.charCodeAt(0) - CHARCODE_A
        boardPoints[sq] = t.points
    }

    const rackTiles = tilesOnRack(tiles, rackName)
    if (rackTiles.length === 0) {
        return []
    }
    const rackCounts = new Int8Array(27)
    const letterPoints = new Int32Array(26)
    const posByLetter = Array.from({ length: 26 }, () => [])
    const blankPositions = []
    for (const t of rackTiles) {
        if (t.letter === "_") {
            rackCounts[26]++
            blankPositions.push(t.pos)
        } else {
            const c = t.letter.charCodeAt(0) - CHARCODE_A
            rackCounts[c]++
            letterPoints[c] = t.points
            posByLetter[c].push(t.pos)
        }
    }

    // Anchors: empty squares adjacent to a submitted tile; the center square
    // on an empty board.
    const anchorSet = new Set()
    let boardEmpty = true
    for (let sq = 0; sq < 225; sq++) {
        if (boardLetter[sq] < 0) {
            continue
        }
        boardEmpty = false
        const col = sq % BOARD_SIZE
        if (col > 0 && boardLetter[sq - 1] < 0) anchorSet.add(sq - 1)
        if (col < BOARD_SIZE - 1 && boardLetter[sq + 1] < 0) anchorSet.add(sq + 1)
        if (sq >= BOARD_SIZE && boardLetter[sq - BOARD_SIZE] < 0) anchorSet.add(sq - BOARD_SIZE)
        if (sq < 225 - BOARD_SIZE && boardLetter[sq + BOARD_SIZE] < 0) anchorSet.add(sq + BOARD_SIZE)
    }
    if (boardEmpty) {
        anchorSet.add(CENTER)
    }

    const moves = []
    const placedLetter = new Int8Array(225).fill(-1)
    const placedBlank = new Uint8Array(225)
    let placedCount = 0
    let blanksUsed = 0

    // Direction-specific state, set before each generation pass
    let step = 1
    let cross = null
    let anchor = 0

    function hasPrev(sq) {
        return step === 1 ? sq % BOARD_SIZE > 0 : sq >= BOARD_SIZE
    }
    function hasNext(sq) {
        return step === 1 ? sq % BOARD_SIZE < BOARD_SIZE - 1 : sq < 225 - BOARD_SIZE
    }
    function childNode(node, c) {
        let k = firstChild[node]
        while (k !== 0 && chr[k] !== c) {
            k = nextSib[k]
        }
        return k
    }

    function record(fromSq, toSq) {
        let mainSum = 0
        let wordMult = 1
        let crossTotal = 0
        const slot = []
        const letters = []
        const blanks = []
        for (let sq = fromSq; sq <= toSq; sq += step) {
            if (boardLetter[sq] >= 0) {
                mainSum += boardPoints[sq]
                continue
            }
            const c = placedLetter[sq]
            const isBlank = placedBlank[sq] === 1
            const pts = isBlank ? 0 : letterPoints[c]
            const lm = LETTER_MULT[sq]
            mainSum += pts * lm
            wordMult *= WORD_MULT[sq]
            if (cross.hasCross[sq]) {
                crossTotal += (cross.crossSum[sq] + pts * lm) * WORD_MULT[sq]
            }
            slot.push("b" + sq)
            letters.push(c)
            blanks.push(isBlank)
        }
        const points =
            mainSum * wordMult + crossTotal + (placedCount === 7 ? 50 : 0)

        const used = new Int8Array(26)
        const rackPerm = []
        let blankLetter = ""
        for (let i = 0; i < letters.length; i++) {
            if (blanks[i]) {
                rackPerm.push(blankPositions[0])
                blankLetter = String.fromCharCode(CHARCODE_A + letters[i])
            } else {
                rackPerm.push(posByLetter[letters[i]][used[letters[i]]++])
            }
        }
        moves.push({ rackPerm, slot, points, letter: blankLetter })
    }

    function tryPlacements(sq, node, andThen) {
        for (let k = firstChild[node]; k !== 0; k = nextSib[k]) {
            const c = chr[k]
            if (c === SEP) {
                continue
            }
            if ((cross.mask[sq] & (1 << c)) === 0) {
                continue
            }
            if (rackCounts[c] > 0) {
                rackCounts[c]--
                placedLetter[sq] = c
                placedBlank[sq] = 0
                placedCount++
                andThen(sq, k)
                placedCount--
                placedLetter[sq] = -1
                rackCounts[c]++
            }
            if (rackCounts[26] > 0 && blanksUsed === 0) {
                rackCounts[26]--
                blanksUsed++
                placedLetter[sq] = c
                placedBlank[sq] = 1
                placedCount++
                andThen(sq, k)
                placedCount--
                placedLetter[sq] = -1
                placedBlank[sq] = 0
                blanksUsed--
                rackCounts[26]++
            }
        }
    }

    function recLeft(sq, node) {
        if (boardLetter[sq] >= 0) {
            const k = childNode(node, boardLetter[sq])
            if (k !== 0) {
                afterLeft(sq, k)
            }
        } else {
            tryPlacements(sq, node, afterLeft)
        }
    }

    function afterLeft(sq, node) {
        const prevOk = hasPrev(sq)
        const prevSq = sq - step
        const leftFree = !prevOk || boardLetter[prevSq] < 0
        if (leftFree) {
            const nextOfAnchor = anchor + step
            const anchorRightFree =
                !hasNext(anchor) || boardLetter[nextOfAnchor] < 0
            if (term[node] === 1 && anchorRightFree && placedCount > 0) {
                record(sq, anchor)
            }
            const sepNode = childNode(node, SEP)
            if (sepNode !== 0 && hasNext(anchor)) {
                recRight(nextOfAnchor, sepNode, sq)
            }
        }
        // A left part may not extend onto another anchor square: any such
        // move is generated from that anchor instead, so each move is found
        // exactly once.
        if (prevOk && (boardLetter[prevSq] >= 0 || !anchorSet.has(prevSq))) {
            recLeft(prevSq, node)
        }
    }

    function recRight(sq, node, startSq) {
        if (boardLetter[sq] >= 0) {
            const k = childNode(node, boardLetter[sq])
            if (k !== 0) {
                afterRight(sq, k, startSq)
            }
        } else {
            tryPlacements(sq, node, (s, k) => afterRight(s, k, startSq))
        }
    }

    function afterRight(sq, node, startSq) {
        const nextOk = hasNext(sq)
        const nextSq = sq + step
        const rightFree = !nextOk || boardLetter[nextSq] < 0
        if (rightFree && term[node] === 1 && placedCount > 0) {
            record(startSq, sq)
        }
        if (nextOk) {
            recRight(nextSq, node, startSq)
        }
    }

    const directions = boardEmpty ? [1] : [1, BOARD_SIZE]
    for (const dir of directions) {
        step = dir
        cross = computeCrossChecks(
            boardLetter,
            boardPoints,
            dir === 1 ? BOARD_SIZE : 1
        )
        for (const a of anchorSet) {
            anchor = a
            recLeft(anchor, 0)
        }
    }

    moves.sort((a, b) => b.points - a.points)
    return moves
}

export function findBestMove(gaddag, tiles, rackName) {
    const moves = generateAllMoves(gaddag, tiles, rackName)
    return moves.length > 0 ? moves[0] : []
}
