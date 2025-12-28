import Modal from "react-bootstrap/Modal"
import styles from './AIThinkingModal.module.css'
import { ProgressBar, Spinner } from "react-bootstrap"
import Rack from "../Rack/Rack"

const AIThinkingModal = ({show, aiSays, numWorkersDone, aiRack, tiles}) => {

    let now = Math.round(100*numWorkersDone/7)

    let aiUbach = aiSays==="" ? "AI thinking..." : aiSays
    return (
        <Modal show={show}>
            <Modal.Body className={styles.modalbody}>
                {/* AI's Rack */}
                {aiRack && tiles && (
                    <div className={styles.rackContainer}>
                        <Rack
                            whichRack={aiRack}
                            tiles={tiles}
                            showTiles={true}
                            DragStart={null}
                            DragOver={null}
                            Drop={null}
                            TouchStart={null}
                            TouchMove={null}
                            TouchEnd={null}
                        />
                    </div>
                )}

                {/* Progress bar */}
                <div className="text-center">
                    {now===0 ? <Spinner animation="border" /> : <ProgressBar animated now={now} label={`${now}%`} style={{minWidth:'250px'}}/>}
                </div>

                {/* AI message */}
                <div className={styles.spinnertext}>{aiUbach}</div>
            </Modal.Body>
        </Modal>
    )
}

export default AIThinkingModal