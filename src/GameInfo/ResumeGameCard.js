import React from "react"
import { Button, Card } from "react-bootstrap"
import Swal from "sweetalert2"
import styles from "./GameInfo.module.css"

const ResumeGameCard = ({ savedPlayerNames, onResumeGame, onDiscardGame }) => {
    const handleDiscard = () => {
        Swal.fire({
            title: "Discard saved game?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Discard",
            confirmButtonColor: '#d33',
            cancelButtonText: "Cancel"
        }).then((result) => {
            if (result.isConfirmed) {
                onDiscardGame()
            }
        })
    }

    return (
        <Card className={`${styles.card} ${styles.shadow2} mb-4`}>
            <Card.Body>
                <Card.Title>Resume Game</Card.Title>
                <Card.Text>
                    You have a saved game with: <strong>{savedPlayerNames}</strong>
                </Card.Text>
                <div className="d-flex gap-2">
                    <Button
                        variant="success"
                        onClick={onResumeGame}
                        className="flex-grow-1"
                    >
                        Resume Game
                    </Button>
                    <Button
                        variant="outline-danger"
                        onClick={handleDiscard}
                    >
                        Discard
                    </Button>
                </div>
                <div className="text-center mt-2 text-muted">
                    <small>or start a new game below</small>
                </div>
            </Card.Body>
        </Card>
    )
}

export default ResumeGameCard
