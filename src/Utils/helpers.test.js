import {
    randomUpTo,
    isLetter,
    getUniqueInts,
    getUniqueInts0,
    range,
    shuffle,
    subtractArrays,
    emptySpot,
    splitArrayToChunks,
    multiplyArrays,
    coords,
    loc,
    arrayToMap,
    makePlayertable
} from './helpers'

describe('helpers', () => {
    describe('randomUpTo', () => {
        it('should return number between 0 and max (inclusive)', () => {
            const max = 10
            for (let i = 0; i < 100; i++) {
                const result = randomUpTo(max)
                expect(result).toBeGreaterThanOrEqual(0)
                expect(result).toBeLessThanOrEqual(max)
                expect(Number.isInteger(result)).toBe(true)
            }
        })

        it('should return 0 when max is 0', () => {
            expect(randomUpTo(0)).toBe(0)
        })
    })

    describe('isLetter', () => {
        it('should return true for letters', () => {
            expect(isLetter('a')).toBe(true)
            expect(isLetter('Z')).toBe(true)
            expect(isLetter('m')).toBe(true)
        })

        it('should return false for non-letters', () => {
            expect(isLetter('1')).toBe(false)
            expect(isLetter('!')).toBe(false)
            expect(isLetter(' ')).toBe(false)
            expect(isLetter('@')).toBe(false)
        })
    })

    describe('getUniqueInts', () => {
        it('should return n unique integers from 1 to N', () => {
            const result = getUniqueInts(5, 10)
            expect(result).toHaveLength(5)

            const uniqueSet = new Set(result)
            expect(uniqueSet.size).toBe(5) // All unique

            result.forEach(num => {
                expect(num).toBeGreaterThanOrEqual(1)
                expect(num).toBeLessThanOrEqual(10)
            })
        })

        it('should handle edge case n = N', () => {
            const result = getUniqueInts(5, 5)
            expect(result).toHaveLength(5)
            expect(new Set(result).size).toBe(5)
        })
    })

    describe('getUniqueInts0', () => {
        it('should return n unique integers from 0 to N-1', () => {
            const result = getUniqueInts0(5, 10)
            expect(result).toHaveLength(5)

            const uniqueSet = new Set(result)
            expect(uniqueSet.size).toBe(5)

            result.forEach(num => {
                expect(num).toBeGreaterThanOrEqual(0)
                expect(num).toBeLessThanOrEqual(9)
            })
        })
    })

    describe('range', () => {
        it('should create range with default step of 1', () => {
            expect(range(0, 5)).toEqual([0, 1, 2, 3, 4])
            expect(range(1, 4)).toEqual([1, 2, 3])
        })

        it('should create range with custom step', () => {
            expect(range(0, 10, 2)).toEqual([0, 2, 4, 6, 8])
            expect(range(0, 15, 5)).toEqual([0, 5, 10])
        })

        it('should handle single element range', () => {
            expect(range(5, 6)).toEqual([5])
        })

        it('should handle edge cases', () => {
            // range with start >= stop creates empty or minimal array
            const result = range(5, 5)
            expect(Array.isArray(result)).toBe(true)
        })
    })

    describe('shuffle', () => {
        it('should return array of same length', () => {
            const original = [1, 2, 3, 4, 5]
            const shuffled = shuffle(original)
            expect(shuffled).toHaveLength(original.length)
        })

        it('should contain all original elements', () => {
            const original = [1, 2, 3, 4, 5]
            const shuffled = shuffle(original)
            expect(shuffled.sort()).toEqual(original.sort())
        })

        it('should not modify original array', () => {
            const original = [1, 2, 3, 4, 5]
            const originalCopy = [...original]
            shuffle(original)
            expect(original).toEqual(originalCopy)
        })

        it('should handle single element array', () => {
            expect(shuffle([1])).toEqual([1])
        })

        it('should handle empty array', () => {
            expect(shuffle([])).toEqual([])
        })
    })

    describe('subtractArrays', () => {
        it('should remove elements of arr2 from arr1', () => {
            const arr1 = [1, 2, 3, 4, 5]
            const arr2 = [2, 4]
            expect(subtractArrays(arr1, arr2)).toEqual([1, 3, 5])
        })

        it('should return arr1 when arr2 is empty', () => {
            const arr1 = [1, 2, 3]
            expect(subtractArrays(arr1, [])).toEqual([1, 2, 3])
        })

        it('should return empty array when all elements are subtracted', () => {
            const arr1 = [1, 2, 3]
            const arr2 = [1, 2, 3]
            expect(subtractArrays(arr1, arr2)).toEqual([])
        })

        it('should handle arr2 with non-existent elements', () => {
            const arr1 = [1, 2, 3]
            const arr2 = [4, 5, 6]
            expect(subtractArrays(arr1, arr2)).toEqual([1, 2, 3])
        })
    })

    describe('emptySpot', () => {
        it('should find first empty spot on rack', () => {
            const tiles = [
                { pos: 'p1', letter: 'A' },
                { pos: 'p2', letter: 'B' },
                { pos: 'p4', letter: 'D' }
            ]
            expect(emptySpot(tiles, 'p')).toBe('p3')
        })

        it('should return false when rack is full', () => {
            const tiles = [
                { pos: 'p1', letter: 'A' },
                { pos: 'p2', letter: 'B' },
                { pos: 'p3', letter: 'C' },
                { pos: 'p4', letter: 'D' },
                { pos: 'p5', letter: 'E' },
                { pos: 'p6', letter: 'F' },
                { pos: 'p7', letter: 'G' }
            ]
            expect(emptySpot(tiles, 'p')).toBe(false)
        })

        it('should return first position when rack is empty', () => {
            expect(emptySpot([], 'p')).toBe('p1')
        })
    })

    describe('splitArrayToChunks', () => {
        it('should split array into equal parts', () => {
            const arr = [1, 2, 3, 4, 5, 6]
            const result = splitArrayToChunks([...arr], 3)
            expect(result).toHaveLength(3)
            expect(result.flat()).toEqual(arr)
        })

        it('should handle uneven split', () => {
            const arr = [1, 2, 3, 4, 5]
            const result = splitArrayToChunks([...arr], 2)
            expect(result).toHaveLength(2)
            expect(result[0].length).toBe(3)
            expect(result[1].length).toBe(2)
        })

        it('should handle single part', () => {
            const arr = [1, 2, 3]
            const result = splitArrayToChunks([...arr], 1)
            expect(result).toEqual([[1, 2, 3]])
        })
    })

    describe('multiplyArrays', () => {
        it('should calculate dot product', () => {
            const arr1 = [1, 2, 3]
            const arr2 = [4, 5, 6]
            // 1*4 + 2*5 + 3*6 = 4 + 10 + 18 = 32
            expect(multiplyArrays(arr1, arr2)).toBe(32)
        })

        it('should handle arrays with zeros', () => {
            const arr1 = [1, 0, 3]
            const arr2 = [4, 5, 6]
            expect(multiplyArrays(arr1, arr2)).toBe(22)
        })

        it('should return null for arrays of different lengths', () => {
            const arr1 = [1, 2]
            const arr2 = [4, 5, 6]
            expect(multiplyArrays(arr1, arr2)).toBeNull()
        })

        it('should handle empty arrays', () => {
            expect(multiplyArrays([], [])).toBe(0)
        })
    })

    describe('coords', () => {
        it('should convert location to coordinates (1-based)', () => {
            const result = coords(112) // Center of 15x15 board
            expect(Array.isArray(result)).toBe(true)
            expect(result).toHaveLength(2)
            // coords uses 1-based indexing
            expect(result[0]).toBe(8)
            expect(result[1]).toBe(8)
        })

        it('should convert top-left corner (1-based)', () => {
            const result = coords(0)
            // 1-based coords start at (1,1)
            expect(result).toEqual([1, 1])
        })

        it('should convert bottom-right corner (1-based)', () => {
            const result = coords(224)
            // 1-based coords end at (15,15)
            expect(result).toEqual([15, 15])
        })
    })

    describe('loc', () => {
        it('should convert coordinates to location (1-based input)', () => {
            // loc() expects 1-based coordinates as input (see line 154 comment)
            expect(loc(8, 8)).toBe(112)  // Center (1-based: row 8, col 8)
            expect(loc(1, 1)).toBe(0)    // Top-left
            expect(loc(15, 15)).toBe(224) // Bottom-right
        })

        it('should be inverse of coords', () => {
            const position = 112
            const [row, col] = coords(position)
            // Both coords and loc use 1-based coordinates
            expect(loc(row, col)).toBe(position)
        })
    })

    describe('arrayToMap', () => {
        it('should convert tile array to map', () => {
            const tiles = [
                { pos: 'b112', letter: 'A', points: 1, submitted: true },
                { pos: 'p1', letter: 'B', points: 3, submitted: false }
            ]
            const map = arrayToMap(tiles)

            expect(map instanceof Map).toBe(true)
            expect(map.size).toBe(2)
            expect(map.get('b112')).toEqual(['A', 1, true])
            expect(map.get('p1')).toEqual(['B', 3, false])
        })

        it('should return empty map for empty array', () => {
            const map = arrayToMap([])
            expect(map.size).toBe(0)
        })
    })

    describe('makePlayertable', () => {
        it('should create player table without shuffling', () => {
            const players = [
                { name: 'Alice', level: 0 },
                { name: 'Bob', level: 0 }
            ]
            const result = makePlayertable(players, "0")

            expect(result).toHaveLength(2)
            expect(result[0].name).toBe('Alice')
            expect(result[0].rack).toBe('p')
            expect(result[0].points).toBe(0)
            expect(result[1].name).toBe('Bob')
            expect(result[1].rack).toBe('q')
        })

        it('should shuffle players when requested', () => {
            const players = [
                { name: 'Alice', level: 0 },
                { name: 'Bob', level: 0 },
                { name: 'Charlie', level: 0 }
            ]
            const result = makePlayertable(players, "1")

            expect(result).toHaveLength(3)
            expect(result.map(p => p.rack)).toEqual(['p', 'q', 'r'])
            // Can't test exact order due to randomness, but can verify all players are present
            const names = result.map(p => p.name).sort()
            expect(names).toEqual(['Alice', 'Bob', 'Charlie'])
        })

        it('should assign racks in order p, q, r, s', () => {
            const players = [
                { name: 'P1', level: 0 },
                { name: 'P2', level: 0 },
                { name: 'P3', level: 0 },
                { name: 'P4', level: 0 }
            ]
            const result = makePlayertable(players, "0")
            expect(result.map(p => p.rack)).toEqual(['p', 'q', 'r', 's'])
        })
    })
})
