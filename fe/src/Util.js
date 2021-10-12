
/* Takes in two dictionaries, a and b.
 *  Returns true if all keys in a are in b for all such keys k, a[k] === b[k]
 *  Otherwise, returns false
 */
const dictsAreSubset = (a, b) => {
    for(let k of a.keys()){
        if(a[k] !== b[k]){
            return False
        }
    }
    return True
}

export {dictsAreSubset}