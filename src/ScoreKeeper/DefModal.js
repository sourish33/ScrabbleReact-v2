import React, { useState } from 'react';
import { useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import styles from './DefModal.module.css'

const SERVER_ADDRESS = "https://scrabble-api-2n61.onrender.com"

export const DefModal = ({show, setShow, word}) => {


  const [showSpinner, setShowSpinner] = useState(true)
  const [definition, setDefinition] = useState("")

  const handleClose = () => {
    setShow(false)
  }

  useEffect(()=>{
    fetch(`${SERVER_ADDRESS}/dictionary?word=${word}`)
    .then(res=>res.json())
    .then((data)=>{
        setShowSpinner(false)
        if (data && data.definition.length>0){
            console.log(data.definition[0].Definition)
            setDefinition(data.definition[0].Definition)
        } else{
            setDefinition("No definition found")
        }
        
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

