'use strict'

var gBoard;
var tableHTML = document.querySelector('.board')
var MINE='M'
var EMPTY= 'E'
var gTimerInterval;
var gSetTimeout;
var hint=false
var hintCount=3
var elHint= document.querySelector('hint'+hintCount)

function createCell(){
    var cell= {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false
    }  
    return cell
}

 
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
   }

   var gLevel = {
    SIZE: 4,
    MINES: 2
   };
   


function startPage(){
    gBoard=buildBoard(4, 2)
    renderBoard(gBoard)
}


function initGame(elButton){
    gGame.isOn=false
    seconds=0
    minutes=0
    clearInterval(gTimerInterval)
    timerHTML.innerText =(minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") 
            + ":" + (seconds > 9 ? seconds : "0" + seconds);

    if(elButton.innerHTML==="Easy"){
        gLevel.SIZE=4 
        gLevel.MINES=2
    } 

    if(elButton.innerHTML==="Medium"){
        gLevel.SIZE=8 
        gLevel.MINES=12
    } 

    if(elButton.innerHTML==="Hard"){
        gLevel.SIZE=12 
        gLevel.MINES=30
    } 

    renderBoard(gBoard)
    gBoard=buildBoard(gLevel.SIZE, gLevel.MINES)
       
}


function buildBoard(size,numOfMines){ 

    var board=[]
    for(var i=0 ; i<size ; i++){
        board.push([])
        for(var j=0 ; j<size ; j++){
            board[i][j]=createCell()                   
        }
    } 
    setMines(board ,numOfMines)
        setMinesNegsCount(board)
        renderBoard(board)

    return board
}



function setMines(board ,numOfMines){
   
   

   for(var i=0 ; i<numOfMines ; i++){

    var randomCol= Math.ceil(Math.random()*board.length-1)
    var randomRow= Math.ceil(Math.random()*board.length-1)

    if(board[randomCol][randomRow].isMine===true) i--
    
    else board[randomRow][randomCol].isMine=true 
    
   }
}


function setMinesNegsCount(board){
  
    for(var i=0 ;i<board.length ; i++){
        
        for(var j=0 ; j<board.length ;j++){
        
       board[i][j].minesAroundCount=countNeighbors(board ,i ,j) 
       
        }
    }  
   
}

function countNeighbors(board , rowIdx, colIdx){
    var count=0
    
     for(var i=rowIdx-1 ;i<=rowIdx+1 ; i++){
         if(i<0 || i>=board.length)continue
         for(var j=colIdx-1 ; j<=colIdx+1 ;j++){
        
         if(j===colIdx && i===rowIdx)continue
         if(j<0 || j>=board.length)continue 
         if(board[i][j].isMine)count++ 
         }    
     }  
     return count  
    }

   function cellClicked(elCell ,row ,col){

    if(gGame.isOn===false){
        firstClick(elCell,row,col)
        gGame.isOn=true
        gTimerInterval= setInterval(getTimer,1000);   
    }

    if(elCell.innerHTML===MINE && !hint){
        gameOver()
        gBoard[row][col].isShown=true
        clearInterval(gTimerInterval)
    }else if(elCell.innerHTML!==MINE && !hint){
        gBoard[row][col].isShown=true
        elCell.classList.remove("hidden")
        var checkForMines=countNeighbors(gBoard ,row,col)

        if(checkForMines===0){
            countAgain(gBoard , row, col) 
        }
    }

    if(hint){
        gBoard[row][col].isShown=true
            elCell.classList.remove("hidden")
            for(var i=row-1 ;i<=row+1 ; i++){
                if(i<0 || i>=gBoard.length)continue
                for(var j=col-1 ; j<=col+1 ;j++){
               
                if(j===col && i===row)continue
                if(j<0 || j>=gBoard.length)continue 
                if(gBoard[i][j].isShown)gBoard[i][j].isShown=false
                else gBoard[i][j].isShown=true
                renderBoard(gBoard)
                }    
            } 
        
        gSetTimeout= setTimeout(function(){
            gBoard[row][col].isShown=false
            elCell.classList.add("hidden")
            for(var i=row-1 ;i<=row+1 ; i++){
                if(i<0 || i>=gBoard.length)continue
                for(var j=col-1 ; j<=col+1 ;j++){
                   
               
                if(j===col && i===row)continue
                if(j<0 || j>=gBoard.length)continue 
                if(gBoard[i][j].isShown===false)gBoard[i][j].isShown=true
                else gBoard[i][j].isShown=false
                renderBoard(gBoard)
                }    
            } 
            hint=!hint
            var elHint = document.querySelector(".hint1")
            elHint.innerHTML=""
        },3000)   
    } 
    isGameWon()
   }


function renderBoard(board){

    var strHTML=''

    for(var i=0 ; i<board.length ; i++){
        
        strHTML+='<tr>'

        for(var j=0 ; j<board[0].length ; j++){
            strHTML+= `<td class="cell"><button class="${!board[i][j].isShown ? 'hidden' : ''} btn row${i}-col${j}"  oncontextmenu="markCell(this, ${i},${j})" 
            onclick="cellClicked(this, ${i},${j})">${board[i][j].isMine ? MINE : board[i][j].minesAroundCount}</button></td>`           
        }
        strHTML+='</td>'
}
tableHTML.innerHTML=strHTML

}

function markCell(elCell ,i ,j){

    var cell=gBoard[i][j]

    if(cell.isShown===false){

    
    if(cell.isMarked===true){
      
       elCell.classList.add("hidden")
       elCell.innerHTML= cell.isMine ? MINE : cell.minesAroundCount
       gGame.markedCount++
       cell.isMarked=!cell.isMarked

    }else{
        elCell.innerHTML= '🚩'
        elCell.classList.remove("hidden")
        gGame.markedCount--
        cell.isMarked=!cell.isMarked
    }
} 
}

function gameOver(){
    
    
    for(var i=0 ; i<gBoard.length ; i++){
        for(var j=0 ; j<gBoard.length ; j++){
            if(gBoard[i][j].isMine===true){
                var currentCell=document.querySelector(`.row${i}-col${j}`)
                currentCell.classList.remove("hidden")
                gBoard[i][j].isShown=true
            }
        }
    }
    gGame.isOn=false
    alert("lose")
}

function isGameWon(){
    
    var countFlaggedMines=0
    var countCorrect=0
    var countCells=0

    for (var i=0 ;i<gBoard.length ;i++){
        for(var j=0 ;j<gBoard.length ;j++){
            var cell= gBoard[i][j]
            if(cell.isMarked && cell.isMine)countFlaggedMines++
            
            if(!cell.isMine && cell.isShown)countCorrect++
            countCells++
           
        }
    
    }
    
    if(countFlaggedMines===gLevel.MINES && countCorrect===countCells-countFlaggedMines){
        
        alert("win")
    }   
}


function countAgain(board , row, col){
                   
                    
    for(var i=row-1 ;i<=row+1 ; i++){
        if(i<0 || i>=board.length)continue
        for(var j=col-1 ; j<=col+1 ;j++){
       
        if(j===col && i===row)continue
        if(j<0 || j>=board.length)continue 
        board[i][j].isShown=true
        renderBoard(board)   
        }    
    } 
} 

function firstClick(elCell,row,col){

    if(elCell.innerHTML===MINE){

        
        gBoard[row][col].isMine=false
        elCell.innerHTML=gBoard[row][col].minesAroundCount
        setMines(gBoard,1)
        renderBoard(gBoard)
        
    }
}

function getHint(elHint){
    
    elHint.innerHTML='<i class="far fa-sun"></i>'
    hint=true   
}

                   
                    
  