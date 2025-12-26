import Modal from "react-bootstrap/Modal"
import styles from './CheckDictionaryModal.module.css'
import { checkDict } from "../Utils/Dictionary/dictionary"
import { useRef, useState } from "react"
import { Button } from "react-bootstrap"
import RackDict from "../Rack/RackDict"

    const CheckDictionaryModal = ({show, onHide, whichRack, tiles}) =>{
    const [word, setWord] = useState("")
    const inputref = useRef(null)

    const Result = ({wordToCheck}) =>{
        if (checkDict(wordToCheck)) {
            return <p><span className={styles.green}>{wordToCheck.toUpperCase()}</span> is valid!</p>
        } else {
            return <p><span className={styles.red}>{wordToCheck.toUpperCase()}</span> is not valid</p>
        }
    }


    const handleChange = (event) =>{
        let word = event.target.value
        setWord(x=>word.split(' ').join(''))
    }
    const clear = () =>{
        setWord("")
    }
    return (
        <Modal show={show} onHide={onHide} onExit={clear} onEntered={() => inputref.current.focus()}>
            <Modal.Header>
                    <RackDict
                        whichRack={whichRack}
                        tiles={tiles}
                    ></RackDict>
            </Modal.Header>
     
                <Modal.Body>
                {/* <div>
                    <RackEx
                        whichRack={whichRack}
                        tiles={tiles}
                        clickHandlerExt={null}
                    ></RackEx>
                </div> */}
                <div className="mt-0">
				<form>
						<div className="input-group mb-3">
							<input type="text" ref={inputref} className="form-control" placeholder="Check dictionary"  
                            value={word}
                            onChange={handleChange} />
							<div className="input-group-append">
							    <Button variant="primary" type="button" onClick={clear}>Clear</Button>
							</div>
						</div>
				</form>
				{word.length>1 && <Result wordToCheck={word}/>}
                <p className={styles.twoletterwords}>AA, AB, AD, AE, AG, AH, AI, AL, AM, AN, AR, AS, AT, AW, AX, AY, BA, BE, BI, BO, BY, CH, DA, DE, DI, DO, EA, EE, ED, EF, EH, EL, EM, EN, ER, ES, ET, EW, EX, 
				FA, FE, FY, GI, GO, GU, HA, HE, HI, HM, HO, ID, IF, IN, IO, IS, IT, JA, JO, KA, KO, KI, KY, LA, LI, LO, MA, ME, MI, MM, MO, MU, MY, NA, NE, NO, NU, NY, OB, OD, OE, OF, OH, OI, OK, 
				OM, ON, OO, OP, OR, OS, OU, OW, OX, OY, PA, PE, PI, PO, QI, RE, SH, SI, SO, ST, TA, TE, TI, TO, UG, UH, UM, UN, UP, UR, US, UT, WE, WO, XI, XU, YA, YE, YO, YU, ZA, ZE, ZO</p>
			</div>
                </Modal.Body>
                <Modal.Footer>
                        <Button variant="secondary" type="button" onClick={onHide}>Cancel</Button>
                    </Modal.Footer>
        </Modal>
    )

}

export default CheckDictionaryModal