import React, { useState } from 'react';
import { useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import styles from './DefModal.module.css'

// Cache for definitions (loaded lazily on first use)
let definitionsCache = null;

// Function to load and retrieve definition
const getDefinition = async (word) => {
  if (!definitionsCache) {
    // Lazy load definitions only when first needed
    const module = await import('../Utils/Dictionary/definitions.js');
    definitionsCache = module.definitions;
  }
  return definitionsCache[word.toUpperCase()] || null;
};

export const DefModal = ({show, setShow, word}) => {


  const [showSpinner, setShowSpinner] = useState(true)
  const [definition, setDefinition] = useState("")

  const handleClose = () => {
    setShow(false)
  }

  useEffect(()=>{
    // Fetch definition from local cache
    getDefinition(word)
      .then((def) => {
        setShowSpinner(false)
        if (def) {
          console.log(def)
          setDefinition(def)
        } else {
          setDefinition("No definition found")
        }
      })
      .catch((error) => {
        console.error('Error loading definition:', error)
        setShowSpinner(false)
        setDefinition("Error loading definition")
      })

    return () => {
        setDefinition("")
        setShowSpinner(true)
    }


  },[word])

  return (
    <>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{word}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Spinner animation="grow" variant="info" className={showSpinner?``:`${styles.hidden}`}/>
            <p>{definition}</p>
            <p className={styles.smalltext}>All words and definitions are from the Collins Official Scrabble Dictionary (2019)</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

