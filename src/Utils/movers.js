import Swal from "sweetalert2"
import { changeLetter, readPoints } from "../Game/GameHelperFunctions"
import { emptySpot, formcheck } from "./helpers"

export function pickBlankLetter() {
    //shows a letter-grid picker for a blank tile; resolves to the chosen
    //letter, or null if the player dismisses the dialog
    const letters = Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ")
    const buttonStyle =
        "padding:8px 0;font-weight:bold;background:rgb(252,252,191);" +
        "border:1px solid #999;border-radius:5px;font-size:18px;cursor:pointer;"
    const grid =
        '<div style="display:grid;grid-template-columns:repeat(6,1fr);gap:6px;">' +
        letters
            .map(
                (l) =>
                    `<button type="button" data-blank-letter="${l}" style="${buttonStyle}">${l}</button>`
            )
            .join("") +
        "</div>"
    return new Promise((resolve) => {
        let picked = null
        Swal.fire({
            title: "Choose a letter for the blank tile",
            html: grid,
            showConfirmButton: false,
            showCloseButton: true,
            didOpen: (popup) => {
                popup.querySelectorAll("[data-blank-letter]").forEach((btn) => {
                    btn.addEventListener("click", () => {
                        picked = btn.getAttribute("data-blank-letter")
                        Swal.close()
                    })
                })
            },
        }).then(() => resolve(picked))
    })
}

const moveType = (orig, dest)=>{
    let fromRack=false
    let toRack = false
    let fromBoard = false
    let toBoard = false
    fromBoard = orig[0]==="b"
    toBoard = dest[0]==="b"
    fromRack = /[pqrs]$/.test(orig[0])
    toRack = /[pqrs]$/.test(dest[0])
    return [fromRack, fromBoard, toRack, toBoard]
  
  }

const move = async (origin, destination, arr) => {
    let tiles = JSON.parse(JSON.stringify(arr))
    if (!formcheck(origin)) {
        //checking origin
        console.log(`invalid origin ${origin}`)
        return null
    }
    if (!formcheck(destination)) {
        //checking destination
        console.log(`invalid destination ${destination}`)
        return null
    }
    let [fromRack, fromBoard, toRack, toBoard] = moveType(origin, destination)
    if (origin === destination) {
        //checking that they are not the same
        console.log("Back to the same location")
        return null
    }
    //checking if something exists are destination
    if (
        tiles.find((el) => {
            return el.pos === destination
        })
    ) {
        if (fromRack && toRack) {
            // checking for a rack reshuffle
            return moveOnRack(origin, destination, arr)
        } 
        if (fromBoard && toRack) {
           let rackSpot = emptySpot(tiles, destination[0])
           if (rackSpot) {
                let ind = tiles.findIndex(el=>el.pos===origin)
                tiles[ind].pos = rackSpot
                return moveOnRack(rackSpot, destination, arr)
           }
        }
            
        console.log("occupied spot")
        return null
    }

    let whatsHere = tiles.find((el) => {
        //can't move if there is nothing to move
        return el.pos === origin
    })
    if (!whatsHere) {
        console.log(`Nothing at origin ${origin}`)
        return null
    }

    if (fromRack && toBoard && readPoints(origin, tiles)===0 ) {
        let newLetter = await pickBlankLetter()
        if (newLetter === null) {
            return null
        }
        tiles = changeLetter(origin, newLetter, tiles)
    }

    if (fromBoard && toRack && readPoints(origin, tiles)===0 ) {
          tiles = changeLetter(origin, "_", tiles)
    }

    tiles = tiles.filter((el) => {
        //removing the entry from the origin
        return el.pos !== origin
    })
    tiles = [
        //and adding it to the destination
        ...tiles,
        {
            pos: destination,
            letter: whatsHere.letter,
            points: whatsHere.points,
            submitted: whatsHere.submitted,
        },
    ]
    tiles.sort((x, y) => {
        return x.pos > y.pos ? 1 : -1
    })
    return tiles
}

function moveOnRack(orig, dest, tiles) {
    let arr = JSON.parse(JSON.stringify(tiles))
    let orignum = parseInt(orig[1])
    let destnum = parseInt(dest[1])

    let r = orig[0]
    let orig_ind = arr.findIndex((el) => el.pos === orig)
    let dest_ind = arr.findIndex((el) => el.pos === dest)
    if (orig_ind === -1 || dest_ind === -1) {
        console.log("orig or dest not found")
        return null
    }
    //remove the tile at the origin
    let orig_entry = arr.filter((el) => el.pos === orig)[0]
    arr = arr.filter((el) => el.pos !== orig)
    //shift other tiles left or right
    if (orignum < destnum) {
        for (let el of arr) {
            if (
                el.pos[0] === r &&
                parseInt(el.pos[1]) > orignum &&
                parseInt(el.pos[1]) < destnum + 1
            ) {
                el.pos = r + (parseInt(el.pos[1]) - 1).toString()
            }
        }
    } else {
        for (let el of arr) {
            if (
                el.pos[0] === r &&
                parseInt(el.pos[1]) > destnum - 1 &&
                parseInt(el.pos[1]) < orignum
            ) {
                el.pos = r + (parseInt(el.pos[1]) + 1).toString()
            }
        }
    }
    //reinsert the removed tile at the desired location
    orig_entry.pos = dest
    arr.push(orig_entry)
    arr.sort((x, y) => {
        return x.pos > y.pos ? 1 : -1
    })
    return arr
}

export default move
