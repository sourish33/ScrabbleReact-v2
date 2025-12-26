
    
import { formcheck } from "./helpers"

export const getSquareIdFromPos = (pos) => {
    let x = pos[0]
    let y = pos[1]
    let whatshere = document.elementsFromPoint(x, y)
    if (whatshere.length === 0) {
        return ""
    }
  
    let idshere = whatshere.map(el=>el.id)
    for (let id of idshere) {
        if (formcheck(id)) {
            return id
        }
    }
    // return "none"
  }
  
  export const getXY = (el) => {
    let rect = el.getBoundingClientRect()
    let posX = (rect.left + rect.right) / 2
    let posY = (rect.top + rect.bottom) / 2
    return [posX, posY]
  }
  
export const setTranslate = (xPos, yPos, el) => {
        if (el!==undefined) { //el might be undefined in some cases with multi-touches.
            el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)"
        }
    }