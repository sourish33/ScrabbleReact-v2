import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import GamePage from './pages/GamePage';
import styles from './App.module.css'

function App() {

  useEffect(() => {
    document.title = "Tortoise Scrabble"
    document.body.parentElement.classList.add(styles.noscrollbar)
    document.body.classList.add(styles.noscrollbar)
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/game" element={<GamePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
