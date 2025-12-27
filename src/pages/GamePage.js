import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Game from '../Game/Game';
import { clearGameData } from '../Utils/localStorage';

const GamePage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get gameVariables from route state
  const gameVariables = location.state?.gameVariables;

  // Redirect to home if no game variables (direct navigation)
  useEffect(() => {
    if (!gameVariables) {
      navigate('/', { replace: true });
    }
  }, [gameVariables, navigate]);

  const exitGame = () => {
    // Clear game state from localStorage
    clearGameData();

    // Navigate back to home (no reload!)
    navigate('/', { replace: true });
  };

  const saveAndExit = () => {
    // Don't clear localStorage - game will be saved
    // Just navigate back to home
    navigate('/', { replace: true });
  };

  if (!gameVariables) {
    return null; // Will redirect in useEffect
  }

  return <Game gameVariables={gameVariables} exitGame={exitGame} saveAndExit={saveAndExit} />;
};

export default GamePage;
