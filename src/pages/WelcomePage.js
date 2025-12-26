import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Swal from 'sweetalert2';
import GameInfo from '../GameInfo/GameInfo';
import styles from './WelcomePage.module.css';

const WelcomePage = () => {
  const navigate = useNavigate();

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
        <GameInfo handleSubmit={handleSubmit} />
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
