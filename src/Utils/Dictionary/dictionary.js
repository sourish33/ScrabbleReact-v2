import { dict } from "./dictformatted"
let scrabbledict = new Set();

for (let word of dict){
  scrabbledict.add(word);
}

export default scrabbledict


export function checkDict(txt) {
  return scrabbledict.has(txt.toUpperCase());
}
