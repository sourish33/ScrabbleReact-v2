import {
    contains,
    readLetter,
    readWord,
    tilesOnRack,
    tilesOnBoard,
    tilesPlayedNotSubmitted,
    score,
    checkLegalPlacement,
    getAllNewWords
} from './GameHelperFunctions'

describe('GameHelperFunctions', () => {
    // Sample tiles for testing
    const mockTiles = [
        { pos: 'b112', letter: 'C', points: 3, submitted: true },
        { pos: 'b113', letter: 'A', points: 1, submitted: true },
        { pos: 'b114', letter: 'T', points: 1, submitted: true },
        { pos: 'p1', letter: 'D', points: 2, submitted: false },
        { pos: 'p2', letter: 'O', points: 1, submitted: false },
        { pos: 'p3', letter: 'G', points: 2, submitted: false },
        { pos: 'b127', letter: 'R', points: 1, submitted: false },
        { pos: 'b142', letter: 'U', points: 1, submitted: false },
        { pos: 'b157', letter: 'N', points: 1, submitted: false },
    ]

    describe('contains', () => {
        it('should return true if position exists in tiles', () => {
            expect(contains('b112', mockTiles)).toBe(true)
            expect(contains('p1', mockTiles)).toBe(true)
        })

        it('should return false if position does not exist in tiles', () => {
            expect(contains('b999', mockTiles)).toBe(false)
            expect(contains('q1', mockTiles)).toBe(false)
        })
    })

    describe('readLetter', () => {
        it('should read letter from string position', () => {
            expect(readLetter('b112', mockTiles)).toBe('C')
            expect(readLetter('b113', mockTiles)).toBe('A')
            expect(readLetter('p1', mockTiles)).toBe('D')
        })

        it('should read letter from array coordinates', () => {
            // Position b112 corresponds to coordinates [7, 7] (center of board)
            expect(readLetter('b112', mockTiles)).toBe('C')
        })

        it('should throw error for non-existent position', () => {
            expect(() => readLetter('b999', mockTiles)).toThrow()
        })

        it('should throw error for empty array', () => {
            expect(() => readLetter([], mockTiles)).toThrow('empty array')
        })

        it('should throw error for invalid position type', () => {
            expect(() => readLetter(123, mockTiles)).toThrow('not string or array')
        })
    })

    describe('readWord', () => {
        it('should read word from array of positions', () => {
            const positions = ['b112', 'b113', 'b114']
            expect(readWord(positions, mockTiles)).toBe('CAT')
        })

        it('should handle single letter', () => {
            expect(readWord(['b112'], mockTiles)).toBe('C')
        })

        it('should return empty string for empty array', () => {
            expect(readWord([], mockTiles)).toBe('')
        })
    })

    describe('tilesOnRack', () => {
        it('should return tiles on rack p', () => {
            const rackTiles = tilesOnRack(mockTiles, 'p')
            expect(rackTiles).toHaveLength(3)
            expect(rackTiles.map(t => t.letter)).toEqual(['D', 'O', 'G'])
        })

        it('should return empty array for rack with no tiles', () => {
            const rackTiles = tilesOnRack(mockTiles, 'q')
            expect(rackTiles).toHaveLength(0)
        })

        it('should only return tiles from specified rack', () => {
            const rackTiles = tilesOnRack(mockTiles, 'p')
            rackTiles.forEach(tile => {
                expect(tile.pos[0]).toBe('p')
            })
        })
    })

    describe('tilesOnBoard', () => {
        it('should return only tiles on board', () => {
            const boardTiles = tilesOnBoard(mockTiles)
            expect(boardTiles).toHaveLength(6)
            boardTiles.forEach(tile => {
                expect(tile.pos[0]).toBe('b')
            })
        })

        it('should handle empty tiles array', () => {
            expect(tilesOnBoard([])).toHaveLength(0)
        })
    })

    describe('tilesPlayedNotSubmitted', () => {
        it('should return only unsubmitted tiles on board', () => {
            const unsubmittedTiles = tilesPlayedNotSubmitted(mockTiles)
            expect(unsubmittedTiles).toHaveLength(3)
            expect(unsubmittedTiles.map(t => t.letter)).toEqual(['R', 'U', 'N'])

            unsubmittedTiles.forEach(tile => {
                expect(tile.pos[0]).toBe('b')
                expect(tile.submitted).toBe(false)
            })
        })

        it('should return empty array if all tiles are submitted', () => {
            const allSubmitted = mockTiles.map(t => ({ ...t, submitted: true }))
            expect(tilesPlayedNotSubmitted(allSubmitted)).toHaveLength(0)
        })

        it('should not include rack tiles even if not submitted', () => {
            const unsubmittedTiles = tilesPlayedNotSubmitted(mockTiles)
            const hasRackTiles = unsubmittedTiles.some(t => t.pos[0] !== 'b')
            expect(hasRackTiles).toBe(false)
        })
    })

    describe('score', () => {
        it('should calculate basic score without premium squares', () => {
            // Create tiles that don't overlap with premium squares
            const simpleTiles = [
                { pos: 'b1', letter: 'A', points: 1, submitted: true },
                { pos: 'b2', letter: 'T', points: 1, submitted: true },
            ]
            const testRack = 'p'
            const result = score(simpleTiles, testRack)
            expect(result).toBeGreaterThanOrEqual(0)
            expect(typeof result).toBe('number')
        })

        it('should not award bingo bonus for empty tiles', () => {
            // Bingo requires exactly 7 tiles played this turn
            const result = score([], 'p')
            expect(result).toBe(0)
        })

        it('should award bingo bonus only when exactly 7 tiles are played', () => {
            // 7 unsubmitted tiles in row 8, cols 2-8 (locs 106-112)
            // includes DL at loc(8,4)=108 and center star (DW) at 112
            const sevenTiles = Array.from({ length: 7 }, (x, i) => ({
                pos: 'b' + (106 + i),
                letter: 'A',
                points: 1,
                submitted: false,
            }))
            // base: 7 letters + 1 extra from DL = 8, center star doubles: 16, bingo: +50
            expect(score(sevenTiles, 'p')).toBe(66)
        })

        it('should not award bingo bonus when fewer than 7 tiles empty the rack', () => {
            // 3 unsubmitted tiles on neutral squares in row 2, cols 7-9 (locs 21-23)
            const threeTiles = [
                { pos: 'b21', letter: 'A', points: 1, submitted: false },
                { pos: 'b22', letter: 'B', points: 1, submitted: false },
                { pos: 'b23', letter: 'C', points: 1, submitted: false },
            ]
            // rack 'p' is empty but only 3 tiles were played: no bingo
            expect(score(threeTiles, 'p')).toBe(3)
        })

        it('should compound multiple triple-word squares (triple-triple = x9)', () => {
            // 8 unsubmitted tiles in row 1, cols 1-8 (locs 0-7)
            // covers TWs at loc(1,1)=0 and loc(1,8)=7, and DL at loc(1,4)=3
            const eightTiles = Array.from({ length: 8 }, (x, i) => ({
                pos: 'b' + i,
                letter: 'A',
                points: 1,
                submitted: false,
            }))
            // base: 8 letters + 1 extra from DL = 9, two TWs: 9 * 3 * 3 = 81
            expect(score(eightTiles, 'p')).toBe(81)
        })
    })

    describe('checkLegalPlacement', () => {
        it('should validate legal placement', () => {
            // This is a complex function that checks dictionary and placement rules
            // Basic test to ensure it returns a boolean
            const result = checkLegalPlacement(mockTiles, true)
            expect(typeof result).toBe('boolean')
        })

        it('should handle empty tiles array', () => {
            const result = checkLegalPlacement([], true)
            expect(typeof result).toBe('boolean')
        })
    })

    describe('getAllNewWords', () => {
        it('should return array of word arrays', () => {
            const result = getAllNewWords(mockTiles, 'p')
            expect(Array.isArray(result)).toBe(true)

            if (result.length > 0) {
                expect(Array.isArray(result[0])).toBe(true)
            }
        })

        it('should handle tiles with no new words', () => {
            const result = getAllNewWords([], 'p')
            expect(Array.isArray(result)).toBe(true)
        })
    })
})
