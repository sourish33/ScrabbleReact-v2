import React, { useEffect } from 'react'
import FrontPage from './FrontPage/FrontPage';
import styles from './App.module.css'




function App() {
  
  useEffect(() => {
    document.title = "Tortoise Scrabble"
    document.body.parentElement.classList.add(styles.noscrollbar)
    document.body.classList.add(styles.noscrollbar)  
 })

  return <FrontPage/>
}

export default App;
