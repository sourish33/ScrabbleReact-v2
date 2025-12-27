import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Swal from 'sweetalert2';
import GameInfo from '../GameInfo/GameInfo';
import styles from './WelcomePage.module.css';
import { STORAGE_KEYS, clearGameData, hasSavedGame as checkSavedGame, getSavedSettings, getSavedPlayersAndPoints } from '../Utils/localStorage';

const WelcomePage = () => {
  const navigate = useNavigate();
  const [hasSavedGame, setHasSavedGame] = useState(false);
  const [savedPlayerNames, setSavedPlayerNames] = useState('');
  const [savedSettings, setSavedSettings] = useState({ dictCheck: "1", gameType: "1000" });

  useEffect(() => {
    // Check if there's a game in progress (non-blocking)
    if (checkSavedGame()) {
      try {
        const playersAndPoints = getSavedPlayersAndPoints();
        const playerNames = playersAndPoints.map(p => p.name).join(', ');
        setSavedPlayerNames(playerNames);
        setHasSavedGame(true);

        // Get saved settings
        const settings = getSavedSettings();
        if (settings) {
          setSavedSettings(settings);
        }
      } catch (error) {
        console.error('Error parsing saved game:', error);
        // Clear corrupted data
        clearGameData();
      }
    }
  }, []);

  const handleResumeGame = () => {
    if (!hasSavedGame) return;

    const playersAndPoints = getSavedPlayersAndPoints();

    const gameVariables = {
      players: playersAndPoints.map(p => ({ name: p.name, level: p.level })),
      shufflePlayers: "0", // Already shuffled in saved state
      dictCheck: savedSettings.dictCheck,
      gameType: savedSettings.gameType
    };

    navigate('/game', { state: { gameVariables } });
  };

  const handleDiscardGame = () => {
    // Clear all saved game data from localStorage
    clearGameData();

    // Hide the resume game card
    setHasSavedGame(false);
    setSavedPlayerNames('');
  };

  const handleSubmit = (event, players, shufflePlayers, dictCheck, gameType) => {
    event.preventDefault();

    // Validation
    if (players.length < 2) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'At least two players required',
      });
      return;
    }

    for (let i = 0; i < players.length; i++) {
      if (players[i].name === "") {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `Please name player ${i + 1}`,
        });
        return;
      }
    }

    // Clear any existing saved game before starting new one
    clearGameData();

    // Hide resume button after starting new game
    setHasSavedGame(false);

    // Save game settings for potential resume
    localStorage.setItem(STORAGE_KEYS.GAME_SETTINGS, JSON.stringify({
      dictCheck: dictCheck,
      gameType: gameType
    }));

    // Build gameVariables object
    const gameVariables = {
      players: players,
      shufflePlayers: shufflePlayers,
      dictCheck: dictCheck,
      gameType: gameType
    };

    // Navigate to /game with state
    navigate('/game', { state: { gameVariables } });
  };

  return (
    <div style={{top:'0.5px'}}>
      <div className={`p-5 mb-4 bg-light rounded-3 ${styles.headerImage}`}>
        <h1 className="display-4">Tortoise Scrabble</h1>
        <h3>A Scrabble Game where it is legal to cheat!</h3>
      </div>
      <Container>
        <GameInfo
          handleSubmit={handleSubmit}
          hasSavedGame={hasSavedGame}
          savedPlayerNames={savedPlayerNames}
          onResumeGame={handleResumeGame}
          onDiscardGame={handleDiscardGame}
        />
        <p style={{textAlign:'right'}}>
          <a
            href="https://forms.gle/4FfSmwEHkgjvYZK7A"
            target="_blank"
            rel="noopener noreferrer"
          >
            Leave Feedback
          </a>
        </p>
      </Container>
    </div>
  );
};

export default WelcomePage;
