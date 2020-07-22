'use strict'

function shuffle(array){
    
var newArray=[]
var random=Math.floor(Math.random()*array.length)
    for(var i=0; i<array.length+1; i++){
        newArray.push(array[random])
        array.splice(random, 1)
        random=Math.floor(Math.random()*array.length)
        i=0
    }
    return newArray  
}

function copyMat(mat){
    var newMat=[]
    for(var i=0 ; i<mat.length ; i++){
        newMat.push([])
        for(var j=0; j<mat.length ; j++){
            newMat[i][j]=mat[i][j]
        }
    }
    console.log(newMat)
}

function createMat(rows ,cols){  //not usable just for copy  
    var mat=[]
    for(var i=0 ; i<rows ; i++){
        mat.push([])
        for(var j=0 ; j<cols ; j++){
            mat[i][j]=i+j
        }
    }
    console.log(mat)
}

function checkNeighbors(mat , colsIdx, rowsIdx){

    var count=0
    for(var i=rowsIdx-1 ; i<=rowsIdx+1 ; i++){
        if(i<0 || i>=mat.length)continue
        for(var j=colsIdx-1 ; j<=colsIdx+1 ; j++){
            if(j<0 || j>=mat.length)continue
            if(j===colsIdx && i===rowsIdx)continue
            if(mat[i][j]===3)count++
        }
    }
    console.log(count);
}

function countNeighbors(mat){
    for(var i=0 ; i<mat.length ; i++){
        for(var j=0 ; j<mat.length ; j++){

            checkNeighbors(mat ,i,j)    
}
        }
    }
    
    var seconds=0
    var minutes=0
    var strHTML=''
    var timerHTML=document.querySelector(".timer")
    
    function getTimer() {
    
        seconds++
            timerHTML.innerText =(minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") 
            + ":" + (seconds > 9 ? seconds : "0" + seconds);
            if (seconds >= 59) {
               seconds = 0;
                minutes++;
                }
            
    }
    