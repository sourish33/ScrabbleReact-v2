// LocalStorage keys
export const STORAGE_KEYS = {
  TILES_AND_BAG: 'scrabble-tilesAndBag',
  PLAYERS_AND_POINTS: 'scrabble-playersAndPoints',
  GAME_STATE: 'scrabble-gameState',
  LAST_PLAYED: 'scrabble-lastPlayed',
  GAME_IS_OVER: 'scrabble-gameIsOver',
  GAME_SETTINGS: 'scrabble-gameSettings'
};

/**
 * Clears all game-related data from localStorage
 */
export const clearGameData = () => {
  localStorage.removeItem(STORAGE_KEYS.TILES_AND_BAG);
  localStorage.removeItem(STORAGE_KEYS.PLAYERS_AND_POINTS);
  localStorage.removeItem(STORAGE_KEYS.GAME_STATE);
  localStorage.removeItem(STORAGE_KEYS.LAST_PLAYED);
  localStorage.removeItem(STORAGE_KEYS.GAME_IS_OVER);
  localStorage.removeItem(STORAGE_KEYS.GAME_SETTINGS);
};

/**
 * Checks if a saved game exists in localStorage
 * @returns {boolean} true if all required game data exists
 */
export const hasSavedGame = () => {
  const gameState = localStorage.getItem(STORAGE_KEYS.GAME_STATE);
  const playersAndPoints = localStorage.getItem(STORAGE_KEYS.PLAYERS_AND_POINTS);
  const tilesAndBag = localStorage.getItem(STORAGE_KEYS.TILES_AND_BAG);

  return !!(gameState && playersAndPoints && tilesAndBag);
};

/**
 * Gets saved game settings from localStorage
 * @returns {Object|null} Game settings object or null if not found
 */
export const getSavedSettings = () => {
  const settings = localStorage.getItem(STORAGE_KEYS.GAME_SETTINGS);
  return settings ? JSON.parse(settings) : null;
};

/**
 * Gets saved players and points from localStorage
 * @returns {Array|null} Players array or null if not found
 */
export const getSavedPlayersAndPoints = () => {
  const playersAndPoints = localStorage.getItem(STORAGE_KEYS.PLAYERS_AND_POINTS);
  return playersAndPoints ? JSON.parse(playersAndPoints) : null;
};
