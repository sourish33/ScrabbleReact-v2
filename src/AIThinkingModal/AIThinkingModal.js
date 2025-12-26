import Modal from "react-bootstrap/Modal"
import styles from './AIThinkingModal.module.css'
import { ProgressBar, Spinner } from "react-bootstrap"

const AIThinkingModal = ({show, aiSays, numWorkersDone}) => {

    let now = Math.round(100*numWorkersDone/7)

    let aiUbach = aiSays==="" ? "AI thinking..." : aiSays
    return (
        <Modal show={show}>
            <Modal.Body className={styles.modalbody}>
                <div className="text-center">
                    {now===0 ? <Spinner animation="border" /> : <ProgressBar animated now={now} label={`${now}%`} style={{minWidth:'250px'}}/>}
                </div>
                <div className={styles.spinnertext}>{aiUbach}</div>
            </Modal.Body>
        </Modal>
    )
}

export default AIThinkingModal