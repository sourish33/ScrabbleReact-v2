/* eslint-disable no-restricted-globals */
import { evaluateMoves } from "../Game/AIHelperFunctions"

// Listen for messages from the main thread
self.addEventListener('message', (e) => {
    const { type, pp, ss, tiles, whichRack, cutoff, toWin, verbose = true } = e.data

    if (type === 'crunch') {
        let result = evaluateMoves(pp, ss, tiles, whichRack, cutoff, toWin)
        if (verbose && pp.length !== 0) {
            self.postMessage(`Done with ${pp[0].length}-letter words, ${result.length} found `)
        }
        self.postMessage(result)
    }
})