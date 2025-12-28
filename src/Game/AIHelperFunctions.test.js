import {
    makeRackPerms,
    makeAllSlots,
} from './AIHelperFunctions'

describe('AIHelperFunctions', () => {
    describe('makeRackPerms', () => {
        it('should generate permutations bins by length', () => {
            const tiles = [
                { pos: 'p1', letter: 'C', points: 3, submitted: false },
                { pos: 'p2', letter: 'A', points: 1, submitted: false },
                { pos: 'p3', letter: 'T', points: 1, submitted: false }
            ]
            const result = makeRackPerms(tiles, 'p')

            expect(Array.isArray(result)).toBe(true)
            // Should return array of 7 bins (one for each length 1-7)
            expect(result.length).toBe(7)

            // Each bin should be an array
            result.forEach(bin => {
                expect(Array.isArray(bin)).toBe(true)
            })

            // First bin should have single-tile permutations
            expect(result[0].length).toBe(3) // ['p1'], ['p2'], ['p3']
        })

        it('should handle single letter rack', () => {
            const tiles = [
                { pos: 'p1', letter: 'A', points: 1, submitted: false }
            ]
            const result = makeRackPerms(tiles, 'p')

            expect(Array.isArray(result)).toBe(true)
            expect(result.length).toBe(7)
            expect(result[0].length).toBe(1) // One single-tile permutation
        })

        it('should handle empty rack', () => {
            const result = makeRackPerms([], 'p')
            expect(Array.isArray(result)).toBe(true)
            expect(result.length).toBe(7)
            // All bins should be empty
            result.forEach(bin => {
                expect(bin).toEqual([])
            })
        })

        it('should include permutations of different lengths in different bins', () => {
            const tiles = [
                { pos: 'p1', letter: 'A', points: 1, submitted: false },
                { pos: 'p2', letter: 'T', points: 1, submitted: false }
            ]
            const result = makeRackPerms(tiles, 'p')

            // Should have permutations in first two bins
            expect(result[0].length).toBeGreaterThan(0) // Length 1
            expect(result[1].length).toBeGreaterThan(0) // Length 2
        })
    })

    describe('makeAllSlots', () => {
        it('should generate slots for valid board state', () => {
            const submittedTiles = [
                { pos: 'b112', letter: 'C', points: 3, submitted: true },
                { pos: 'b113', letter: 'A', points: 1, submitted: true },
            ]
            const result = makeAllSlots(submittedTiles)

            expect(Array.isArray(result)).toBe(true)
            // Each slot should be an array of positions
            if (result.length > 0) {
                expect(Array.isArray(result[0])).toBe(true)
            }
        })

        it('should handle empty board (first move)', () => {
            const result = makeAllSlots([])

            expect(Array.isArray(result)).toBe(true)
            // On empty board, should return slots through center square (b112)
            expect(result.length).toBeGreaterThan(0)
        })

        it('should generate horizontal and vertical slots', () => {
            const submittedTiles = [
                { pos: 'b112', letter: 'A', points: 1, submitted: true }
            ]
            const result = makeAllSlots(submittedTiles)

            expect(Array.isArray(result)).toBe(true)
            expect(result.length).toBeGreaterThan(0)
        })
    })

    describe('AI Move Generation Integration', () => {
        it('should handle basic AI move scenario', () => {
            // Test that the components work together
            const tiles = [
                { pos: 'p1', letter: 'C', points: 3, submitted: false },
                { pos: 'p2', letter: 'A', points: 1, submitted: false },
                { pos: 'p3', letter: 'T', points: 1, submitted: false }
            ]
            const submittedTiles = []

            const perms = makeRackPerms(tiles, 'p')
            const slots = makeAllSlots(submittedTiles)

            // perms should be array of 7 bins
            expect(perms.length).toBe(7)
            // slots should be array of 7 bins
            expect(slots.length).toBe(7)

            // Verify data structure integrity - each bin is an array
            perms.forEach(bin => {
                expect(Array.isArray(bin)).toBe(true)
            })
            slots.forEach(bin => {
                expect(Array.isArray(bin)).toBe(true)
            })
        })
    })
})
