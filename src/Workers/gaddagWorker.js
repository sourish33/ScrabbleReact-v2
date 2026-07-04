/* eslint-disable no-restricted-globals */
import { dict } from "../Utils/Dictionary/dictformatted"
import { buildGaddag, findBestMove } from "../Game/Gaddag"

// Unlike worker.js, this worker is kept alive for the whole game so the
// GADDAG (built once from the dictionary) can be reused across turns.
let gaddag = null

function ensureGaddag() {
    if (!gaddag) {
        gaddag = buildGaddag(dict)
    }
    return gaddag
}

self.addEventListener('message', (e) => {
    const { type, tiles, whichRack } = e.data

    if (type === 'warmup') {
        ensureGaddag()
        return
    }

    if (type === 'gaddagMove') {
        if (!gaddag) {
            self.postMessage('Building the word graph...')
            ensureGaddag()
        }
        self.postMessage('Considering every possible move...')
        const best = findBestMove(gaddag, tiles, whichRack)
        self.postMessage({ type: 'gaddagResult', best })
    }
})
