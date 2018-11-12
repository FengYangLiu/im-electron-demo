let oldFaceSize = [];
let fhFaceSize = [];

 function createOldFace (){
    const row = 7;
    const col = 15;
    oldFaceSize = []
    for(let i = 0; i<row; i++){
        for(let j = 0; j<col; j++){
            const obj = {
                backgroundX: -4 - ( j * 20 + j * 8.845),
                backgroundY: -4 - ( i * 20 + i * 8.85)
            }
            oldFaceSize.push(obj)
        }
    }
    return oldFaceSize
}

function createFhFace(){

}

createOldFace();
createFhFace();

export {
    oldFaceSize,
    fhFaceSize
}