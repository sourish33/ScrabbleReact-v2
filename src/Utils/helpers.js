export function randomUpTo(max) {
    // min and max included
    let min = 0
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export function isLetter(c) {
    return c.toLowerCase() !== c.toUpperCase()
}

export function getUniqueInts(n, N = 225) {
    //returns a random integer from 1 to N
    let arr = Array.from({ length: N }, (x, i) => i + 1)
    return shuffle(arr).slice(0, n)
}

export function getUniqueInts0(n, N = 225) {
    //returns a random integer from 0 to N-1
    let arr = Array.from({ length: N }, (x, i) => i )
    return shuffle(arr).slice(0, n)
}

export const range = (start, stop, step = 1) =>
  Array(Math.ceil((stop - start) / step)).fill(start).map((x, y) => x + y * step)

export function shuffle(arr) {
    //takes an array and returns a shuffled version
    let L = arr.length - 1
    let sarr = Array.from(arr) //cannot use = cuz JS passes by reference in this case

    for (let i = L; i > 0; i--) {
        const j = Math.floor(Math.random() * i)
        const temp = sarr[i]
        sarr[i] = sarr[j]
        sarr[j] = temp
    }
    return sarr
}

export function subtractArrays(arr1, arr2) {
    //returns the elements of the longer array (arr1) that are not present in the shorter array (arr2)
    // Use Set for O(1) lookups instead of O(n) array.includes()
    const set2 = new Set(arr2)
    return arr1.filter((value) => !set2.has(value))
}

export function emptySpot(arr, whichRack) {
    for (let i = 1; i < 8; i++) {
        let u = arr.find((el) => {
            return el.pos === whichRack + i
        })
        if (!u) {
            return whichRack + i
        }
    }
    return false
}

export function splitArrayToChunks(array, parts) {
    //breaks up an array into "parts" parts
    let result = [];
    for (let i = parts; i > 0; i--) {
        result.push(array.splice(0, Math.ceil(array.length / i)));
    }
    return result;
}


export function multiplyArrays(arr1, arr2) {
    //dot product
    if (arr1.length !== arr2.length) {
        console.log("cant multiply arrays of different sizes")
        return null
    }
    let result = 0
    for (let i = 0; i < arr1.length; i++) {
        result += arr1[i] * arr2[i]
    }
    return result
}

export function multiplyScalar(a, b) {
    //multiply a scalar with each element of an array
    let num, arr
    if (Array.isArray(a)) {
        arr = a
        num = b
    } else {
        arr = b
        num = a
    }
    let result = []
    for (let i = 0; i < arr.length; i++) {
        result.push(arr[i] * num)
    }
    return result
}

export function isContiguous(arr){
    if (arr.length===1){ return true}
    arr.sort((x,y)=>x-y)
    for (let i = 0; i < arr.length - 1; i++) {
      let u = arr[i]
      let v = arr[i + 1]
      if (v !== u + 1) {
          return false
      }
    }
    return true
  }

export const getConsecutivesNums = (data) => {
    //returns arrays of consecutive numbers from an array of numbers
    data.sort((x, y) => x - y)
    let groups = []
    let start = 0
    let end = 0
    for (let i = 0; i < data.length; i++) {
        if (data[i + 1] === data[end] + 1) {
            end = i + 1
        } else {
            groups.push(data.slice(start, end + 1))
            start = i + 1
            end = i + 1
        }
    }
    return groups.filter((x) => x.length > 1)
}

export function addLeft(n, arr) {
    return arr.map((el) => [n, el])
}

export function addLeftAll(n, Arr) {
    return Arr.map((el) => addLeft(n, el))
}

export function addRight(n, arr) {
    return arr.map((el) => [el, n])
}

export function addRightAll(n, Arr) {
    return Arr.map((el) => addRight(n, el))
}

export function getUniques(arr) {
    //returns unique elements in an array
    return Array.from(new Set(arr))
}

export const loc = (down, across) => {
    down=parseInt(down)
    across=parseInt(across)
    //gives the number of a square on the board when given the down and across coordinates from the top left corner (1,1)
    return 15 * (down - 1) + across - 1
}

export const coords = (n) => {
    //inverse of loc
    let x = Math.floor(n / 15) + 1
    let y = (n % 15) + 1
    return [x, y]
}

export function b_loc(posn) {
    //takes [2,3] and returns b17
    return "b" + loc(...posn)
}

export function b_coords(posn){
    //takes b17 and returns [2,3]
    let n = parseInt(posn.substring(1))
    return coords(n)
  }

export function countBlanks(str){
    let blanks =0
    for (let l of str){
        if (l=== "_"){
            blanks+=1
        }
    }
    return blanks
}

export function formcheck(id) {
    return /[bpqrs]\d+$/.test(id)
}

export function arrayToMap(arr) {
    //takes an array of objects and returns a map

    let amap = new Map()
    if (arr.length === 0) {
        return amap
    }
    for (let el of arr) {
        amap.set(el.pos, [el.letter, el.points, el.submitted])
    }
    return amap
}

export function makePlayertable(players, shouldShuffle) {
    let playerList = shouldShuffle === "0" ? players : shuffle(players)
    const racks = ["p", "q", "r", "s"]
    const playerTable = playerList.map((el, ind) => {
        return { name: el.name, level: el.level, points: 0, rack: racks[ind] }
    })
    return playerTable
}
export function coordsTolocWord(word) {
    //converts an array of tiles in form (1,2) to  form "b112"
    return word.map((el) => {
        return "b" + loc(el[0], el[1])
    })
}

export function coordsTolocWordArr(wordArr) {
    //applies coordsTolocWord to each word in the array
    return wordArr.map((el) => {
        return coordsTolocWord(el)
    })
}

export function intersection(array1, array2) {
    return array1.filter((value) => array2.includes(value))
}

export function anyCommonElements(array1, array2) {
    // Use Set for O(n) instead of O(n*m) complexity
    const set2 = new Set(array2)
    return array1.some((el) => set2.has(el))
}

export function neighbors(pos){
    let n = parseInt(pos.substring(1))
    if (n<0 || n>224) {
      throw new Error (`${pos} invalid input for neighbors`)
    }
    let bors = []
    let [y,x] = coords(n)
    if (n-1>=0 && coords(n-1)[0]===y){
      bors.push("b"+(n-1).toString())
    }
    if (n-15>=0 && coords(n-15)[1]===x){
      bors.push("b"+(n-15).toString())
    }
    if (n+1<=224 && coords(n+1)[0]===y){
      bors.push("b"+(n+1).toString())
    }
    if (n+15<=224 && coords(n+15)[1]===x){
      bors.push("b"+(n+15).toString())
    }
    return bors
}

export function permute(permutation) {
    let length = permutation.length,
        result = [permutation.slice()],
        c = new Array(length).fill(0),
        i = 1, k, p;
  
    while (i < length) {
      if (c[i] < i) {
        k = i % 2 && c[i];
        p = permutation[i];
        permutation[i] = permutation[k];
        permutation[k] = p;
        ++c[i];
        i = 1;
        result.push(permutation.slice());
      } else {
        c[i] = 0;
        ++i;
      }
    }
    return result;
  }


  
function k_combinations(arr, k) {
    let i, j, combs, head, tailcombs;
    
    // There is no way to take e.g. arrs of 5 elements from
    // a arr of 4.
    if (k > arr.length || k <= 0) {
        return [];
    }
    
    // K-sized arr has only one K-sized subarr.
    if (k === arr.length) {
        return [arr];
    }
    
    // There is N 1-sized subarrs in a N-sized arr.
    if (k === 1) {
        combs = [];
        for (i = 0; i < arr.length; i++) {
            combs.push([arr[i]]);
        }
        return combs;
    }
    
    
    combs = [];
    for (i = 0; i < arr.length - k + 1; i++) {
        // head is a list that includes only our current element.
        head = arr.slice(i, i + 1);
        // We take smaller combinations from the subsequent elements
        tailcombs = k_combinations(arr.slice(i + 1), k - 1);
        // For each (k-1)-combination we join it with the current
        // and store it to the arr of k-combinations.
        for (j = 0; j < tailcombs.length; j++) {
            combs.push(head.concat(tailcombs[j]));
        }
    }
    return combs;
}



export function combinations(arr) {
    let k, i, combs, k_combs;
    combs = [];
    
    // Calculate all non-empty k-combinations of size 2 and higher
    for (k = 2; k <= arr.length; k++) {
        k_combs = k_combinations(arr, k);
        for (i = 0; i < k_combs.length; i++) {
            combs.push(k_combs[i]);
        }
    }
    return combs;
}


 