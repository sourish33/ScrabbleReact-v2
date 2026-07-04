import { dict } from "../Utils/Dictionary/dictformatted"
import { buildGaddag, generateAllMoves, findBestMove } from "./Gaddag"
import {
    makeRackPerms,
    makeAllSlots,
    evaluateMoves,
    evaluateMove,
    evaluateMoveBlank,
} from "./AIHelperFunctions"

const PTS = {
    A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1, J: 8, K: 5, L: 1,
    M: 3, N: 1, O: 1, P: 3, Q: 10, R: 1, S: 1, T: 1, U: 1, V: 4, W: 4, X: 8,
    Y: 4, Z: 10, _: 0,
}

function rackTiles(letters, rack = "q") {
    return letters.split("").map((l, i) => ({
        pos: rack + (i + 1),
        letter: l,
        points: PTS[l],
        submitted: true,
    }))
}

function boardWord(word, startSq, step) {
    return word.split("").map((l, i) => ({
        pos: "b" + (startSq + i * step),
        letter: l,
        points: PTS[l],
        submitted: true,
    }))
}

// Re-scores a generated move with the existing brute-force evaluator, which
// independently checks every formed word against the dictionary. Returns
// null for illegal moves.
function evaluatorScore(move, tiles, rack) {
    if (move.letter) {
        const blankInd = move.rackPerm.findIndex((p) => {
            const t = tiles.find((x) => x.pos === p)
            return t && t.letter === "_"
        })
        return evaluateMoveBlank(
            move.rackPerm,
            blankInd,
            move.slot,
            tiles,
            rack,
            move.letter
        )
    }
    return evaluateMove(move.rackPerm, move.slot, tiles, rack)
}

function assertAllMovesValid(moves, tiles, rack) {
    for (const m of moves) {
        expect(evaluatorScore(m, tiles, rack)).toBe(m.points)
    }
}

// Exhaustive brute-force best score (only viable for small racks/boards)
function bruteBestPoints(tiles, rack) {
    const perms = makeRackPerms(tiles, rack)
    const hasBoard = tiles.some((t) => t.pos[0] === "b" && t.submitted)
    const slots = makeAllSlots(tiles, hasBoard)
    let best = -1
    for (let i = 0; i < 7; i++) {
        const moves = evaluateMoves(perms[i], slots[i], tiles, rack, 1e9, 1e9)
        for (const m of moves) {
            if (m.points > best) best = m.points
        }
    }
    return best
}

let gaddag

beforeAll(() => {
    gaddag = buildGaddag(dict)
}, 120000)

describe("buildGaddag", () => {
    it("stores every rotation of a word", () => {
        // For HORN the full-reverse sequence NROH must be terminal
        const { chr, firstChild, nextSib, term } = gaddag
        function child(node, c) {
            let k = firstChild[node]
            while (k !== 0 && chr[k] !== c) k = nextSib[k]
            return k
        }
        const walk = (letters) => {
            let node = 0
            for (const l of letters) {
                node = child(node, l === ">" ? 26 : l.charCodeAt(0) - 65)
                if (node === 0) return null
            }
            return node
        }
        expect(term[walk("NROH")]).toBe(1) // REV(HORN)
        expect(term[walk("OH>RN")]).toBe(1) // REV(HO) > RN
        expect(walk("QQX")).toBe(null)
    })
})

describe("generateAllMoves", () => {
    it("matches exhaustive brute force on an empty board", () => {
        const tiles = rackTiles("RETAINS")
        const moves = generateAllMoves(gaddag, tiles, "q")
        expect(moves.length).toBeGreaterThan(0)
        // RETAINS is a 7-letter word: bingo must be found
        expect(moves[0].points).toBeGreaterThanOrEqual(50)
        assertAllMovesValid(moves, tiles, "q")
        expect(moves[0].points).toBe(bruteBestPoints(tiles, "q"))
    }, 120000)

    it("matches exhaustive brute force with a small rack on a board", () => {
        const tiles = [...boardWord("HORN", 110, 1), ...rackTiles("CAT")]
        const moves = generateAllMoves(gaddag, tiles, "q")
        expect(moves.length).toBeGreaterThan(0)
        assertAllMovesValid(moves, tiles, "q")
        expect(moves[0].points).toBe(bruteBestPoints(tiles, "q"))
    }, 120000)

    it("generates only valid moves with a full rack on a crossed board", () => {
        // QUANT across row 8, UNIT down through its N
        const tiles = [
            ...boardWord("QUANT", 108, 1),
            ...boardWord("U", 96, 15),
            ...boardWord("IT", 126, 15),
            ...rackTiles("SATIRED"),
        ]
        const moves = generateAllMoves(gaddag, tiles, "q")
        expect(moves.length).toBeGreaterThan(0)
        assertAllMovesValid(moves, tiles, "q")
    }, 120000)

    it("handles blanks and never beats the evaluator's opinion of the move", () => {
        const tiles = [...boardWord("HORN", 110, 1), ...rackTiles("SA_")]
        const moves = generateAllMoves(gaddag, tiles, "q")
        expect(moves.length).toBeGreaterThan(0)
        assertAllMovesValid(moves, tiles, "q")
        // at least one move should use the blank (letter is set)
        expect(moves.some((m) => m.letter !== "")).toBe(true)
        // blank moves must reference the blank's rack position
        for (const m of moves.filter((x) => x.letter !== "")) {
            expect(m.rackPerm).toContain("q3")
        }
    }, 120000)

    it("uses at most one blank per move", () => {
        const tiles = [...boardWord("HORN", 110, 1), ...rackTiles("__A")]
        const moves = generateAllMoves(gaddag, tiles, "q")
        assertAllMovesValid(moves, tiles, "q")
        for (const m of moves) {
            const blanksUsed = m.rackPerm.filter((p) => {
                const t = tiles.find((x) => x.pos === p)
                return t.letter === "_"
            }).length
            expect(blanksUsed).toBeLessThanOrEqual(1)
        }
    }, 120000)

    it("handles a tiny endgame rack", () => {
        const tiles = [...boardWord("HORN", 110, 1), ...rackTiles("QI")]
        const moves = generateAllMoves(gaddag, tiles, "q")
        assertAllMovesValid(moves, tiles, "q")
        expect(moves[0].points).toBe(bruteBestPoints(tiles, "q"))
    }, 120000)

    it("returns [] from findBestMove when no move exists", () => {
        // A lone Q next to HORN can't make any word
        const tiles = [...boardWord("HORN", 110, 1), ...rackTiles("Q")]
        expect(findBestMove(gaddag, tiles, "q")).toEqual([])
    }, 120000)

    it("returns [] for an empty rack", () => {
        const tiles = [...boardWord("HORN", 110, 1)]
        expect(findBestMove(gaddag, tiles, "q")).toEqual([])
    }, 120000)
})
