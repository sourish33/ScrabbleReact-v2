import { evaluateMoves } from "../Game/AIHelperFunctions"

export function crunch(pp, ss, tiles, whichRack, cutoff, toWin, verbose=true) {
    let result = evaluateMoves(pp, ss, tiles, whichRack, cutoff, toWin )
    if (verbose && pp.length!==0){
        postMessage(`Done with ${pp[0].length}-letter words, ${result.length} found `)
    }
    postMessage(result)
}