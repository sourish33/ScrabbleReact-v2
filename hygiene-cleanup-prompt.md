# Prompt: Hygiene cleanup pass for ScrabbleReact-v2

Copy everything below the line into a fresh Claude Code session when you're ready to do the cleanup.

---

Please do a hygiene/cleanup pass on this codebase. These are refactors and chores only — **no behavior changes** except where explicitly noted. Work through the items in order (they're sorted so earlier items make later ones easier), run `npx vitest run` after each one, and `npm run build` at the end.

## Context from the previous session (July 2026)

The gameplay-feature pass already landed these, so don't redo them:
- `exchangeTiles(tiles, bag, tilesToReturn, submitted)` was extracted into `src/Game/GameHelperFunctions.js` and is used by both the human exchange modal (`handleExchSubmit`) and the AI exchange (`aiExchange`) in `src/Game/Game.js`.
- The per-turn worker spawning was replaced with a persistent 7-worker pool (`workerPoolRef` / `getPoolWorker` in Game.js).
- `move()` in `src/Utils/movers.js` is now **async** (it awaits a SweetAlert2 letter picker for blanks). Keep it async.
- A `visibleRack` variable is computed once in Game.js's render body and passed to BoardAndRack and ScoreKeeper.
- `lastPlayed` entries now carry a `bingo: boolean` field for real plays.

## 1. Extract the duplicated "draw from bag" logic

`aiGetTiles` and `replenishRack` in `src/Game/Game.js` contain the same ~15 lines (find free rack slots, pick random bag indices, build tile objects, subtract from bag). The drawing half of `exchangeTiles` in `GameHelperFunctions.js` is a third near-copy.

Extract a pure helper into `src/Game/GameHelperFunctions.js`:

```js
// draws up to positions.length tiles from bag into the given positions;
// returns [addedTiles, newBag]
export function drawTiles(bag, positions, submitted)
```

Then rewrite `aiGetTiles`, `replenishRack`, and the draw section of `exchangeTiles` to use it. Behavior must be identical, including: drawing `Math.min(freeSlots.length, bag.length)` tiles, `parseInt` on the points string, and (for exchanges) drawing only from the pre-return bag so a returned tile can't be redrawn in the same exchange.

Add unit tests for `drawTiles` in `GameHelperFunctions.test.js`: draws fewer tiles when the bag is short, empty bag, empty positions, tile shape (`pos`/`letter`/`points` as number/`submitted`).

## 2. Use the localStorage util in Game.js

`hideModalVictory` in `src/Game/Game.js` hand-writes six `localStorage.removeItem('scrabble-...')` calls. Replace them with `clearGameData()` from `src/Utils/localStorage.js` (already imported elsewhere in the app). Also sweep for any other hand-written `'scrabble-...'` string keys outside `localStorage.js` and replace with `STORAGE_KEYS` — but note the `useLocalStorage`/`useLocalStorageReducer` hook call sites in Game.js pass key strings; switching those to `STORAGE_KEYS.X` constants is in scope and safe (same string values).

## 3. Delete the scratch test files

Delete `src/testing/test.js` and `src/testing/test1.js` (~1,100 lines of scratch code). Git history preserves them. Verify nothing imports from `src/testing` first (nothing did as of July 2026). Remove the empty directory.

## 4. Remove the vestigial gh-pages deploy path

The app deploys via Vercel (`vercel.json`). Remove from `package.json`: the `gh-pages` devDependency, and the `predeploy`/`deploy` scripts. Run `npm install` to update the lockfile. Do **not** touch the `prebuild`/`process-dictionary`/`update-sw-version` scripts.

## 5. Gate console.logs behind a debug flag

Create a tiny logger, e.g. `src/Utils/debug.js`:

```js
export const DEBUG = import.meta.env.DEV
export const debugLog = (...args) => { if (DEBUG) console.log(...args) }
```

Replace the stray `console.log` calls in `src/Utils/movers.js`, `src/Game/Game.js`, `src/Game/AIHelperFunctions.js`, and `src/BoardAndRack.js` with `debugLog`. Leave `console.error` calls alone. Note `AIHelperFunctions.js` runs inside web workers — `import.meta.env.DEV` works there under Vite, but confirm the worker build still passes (`npm run build`).

## 6. Rename the opaque identifiers (carefully — persisted state!)

In `src/Game/Game.js`:
- `gsreducer` → `gameStateReducer`, `tbdispatch` → `tilesAndBagDispatch` — pure renames, safe.
- The `p1..p7` / `s1..s7` destructuring in `aiPlay` can become array variables (`allPerms`, `allSlots`) since they're immediately re-wrapped into arrays anyway.
- **Do NOT rename the `mn`/`cp` keys inside the persisted `gameState` object** without a migration: the shape `{mn, cp}` is saved to localStorage (`scrabble-gameState`) and a rename would break every saved game. Two acceptable options — (a) leave the stored keys as `mn`/`cp` and just keep the existing `const { cp: currentPlayer } = gameState` destructures (cheapest, fine), or (b) rename to `{moveNumber, currentPlayer}` AND add a read-time migration in `useLocalStorageReducer`'s initializer that maps old keys to new. Pick (a) unless you have a reason not to.

## 7. Add the missing regression tests

In the existing test files (vitest):
- `score`/`scoreWord` (`GameHelperFunctions.test.js`): a word spanning **two TW squares** must multiply ×9; a word with a DW and a TW must be ×6; bingo bonus applies only when exactly 7 unsubmitted tiles are on the board (6 tiles → no +50).
- `exchangeTiles`: exchanging N tiles keeps bag length constant, returned tiles get unused serials, returned tiles cannot appear in the same draw, tile conservation (tiles + bag count unchanged).
- The AI-exchange guard logic if it's extractable: with `bag.length < 7` the AI must pass, and after an AI exchange the same AI's next no-move turn must pass rather than exchange again (the anti-loop guard `aiShouldExchange` in Game.js — consider extracting it to a pure function `shouldExchange(bagLength, rackTiles, lastActionWord)` so it's testable).
- `pickMoveForLevel` in Game.js — same story: extract the band-picking math into a pure function (it only needs `sortedMoves` and `level`) in `AIHelperFunctions.js`, then test: level 4/unknown returns `sortedMoves[0]`, empty list returns `[]`, level 1 with 100 moves never returns index < 25 or > 60 (run it a few hundred times), single-move list always returns that move.

## 8. (Optional, only if you're feeling ambitious) Component/hook extractions

Game.js is ~950 lines. Natural seams, in order of value:
- `useAIPlayer()` hook: everything between the `START AI PLAY GROUP` / `END AI PLAY GROUP` comments plus the worker pool and GADDAG refs/effects.
- `useTilesAndBag()`: the reducer, `updateTiles`, `updateTilesAndBag`, `replenishRack`.
- Move the exchange-modal selection state (`selectedTiles`, `clickHandlerExt`) into `ExchangeTilesModal` itself, with a single `onSubmit(tilesToReturn)` callback back to Game.

Do these only after 1–7 are green, one at a time, running the full test suite between each.

## Verification

- `npx vitest run` after each item (84 tests were green before this pass; you'll be adding more in item 7).
- `npm run build` at the end.
- Smoke-test the real app: `npm run dev`, start a 2-player game and an AI game, play a word, exchange tiles, let the AI take a turn. A Playwright drive script from the feature pass exists as a reference pattern (seed the six `scrabble-*` localStorage keys, reload, click "Resume Game").
