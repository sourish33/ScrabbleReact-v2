import Modal from "react-bootstrap/Modal"
import styles from "./Instructions.module.css"
import { Button, CloseButton } from "react-bootstrap"
import PlayInstructions from "./PlayInstructions"
import StartInstructions from "./StartInstructions"

const Instructions = ({ show, onHide, playInstr }) => {
    return (
        <Modal show={show} size="lg" centered>
        <Modal.Header className={styles.centerAlign}>
            <Modal.Title>
                <h1 style={{ margin: 0, fontSize: '1.75rem' }}>
                    {playInstr ? "How to Play" : "Getting Started"}
                </h1>
            </Modal.Title>
        <CloseButton onClick={onHide} variant="white" />
        </Modal.Header>
            <Modal.Body className={styles.instructionsBody}>
                {playInstr ? <PlayInstructions/>: <StartInstructions/>}
            </Modal.Body>
            <Modal.Footer className={styles.rightAlign}>
                    <Button variant="primary" type="button" onClick={onHide}>Got it!</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default Instructions
