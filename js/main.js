'use strict'

var gBoard;
var tableHTML = document.querySelector('.board')
var MINE='💣'
var gTimerInterval;
var gSetTimeout;
var hint=false
var hintCount=3
var elHint= document.querySelector('hint'+hintCount)
var restartHTML= document.querySelector(".restart")
var gameDone=false
var livesCount=3
var countSafeClicks=3
var mineSound= new Audio("sounds/explosion.mp3")
var winSound= new Audio('sounds/cheer.mp3')
var gameOverSound = new Audio('sounds/cry.mp3')
var userName;

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
    hintCount=3
    livesCount=3
    countSafeClicks=3
    document.querySelector(".safe").innerHTML=`SAFE ${countSafeClicks}`
    gameDone=false
    gGame.isOn=false
    seconds=0
    minutes=0
    clearInterval(gTimerInterval)
    timerHTML.innerText =(minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") 
            + ":" + (seconds > 9 ? seconds : "0" + seconds);

            restartHTML.innerHTML='🙂'

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
    
    gBoard=buildBoard(gLevel.SIZE, gLevel.MINES)
    renderBoard(gBoard)      
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
    console.log(numOfMines);
    renderHints()
    renderLives()
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

    if(gameDone)return

    var currCell= gBoard[row][col]

    if(gGame.isOn===false){
        firstClick(elCell,row,col)
        gGame.isOn=true
        gTimerInterval= setInterval(getTimer,1000);   
    }
    if(currCell.isMarked)return

    if(elCell.innerHTML===MINE && livesCount>0){
        livesCount--
        renderLives()
        mineSound.play()
    }

    if(elCell.innerHTML===MINE && !hint && livesCount===0){
        gameOver()
        gBoard[row][col].isShown=true
        elCell.style.backgroundColor='red'
        clearInterval(gTimerInterval)
        gameOverSound.play()
        
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
            hintCount--
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
            
            renderHints(hintCount)
           
        },1000)   
    } 

    isGameWon()
    if(gameDone)clearInterval(gTimerInterval)
   }


function renderBoard(board){

    var strHTML=''

    for(var i=0 ; i<board.length ; i++){
        
        strHTML+='<tr>'

        for(var j=0 ; j<board[0].length ; j++){
            strHTML+= `<td class="cell"><button class="${!board[i][j].isShown && !board[i][j].isMarked ? 'hidden' : ''} btn row${i}-col${j} ${getColor(board,i,j)}"  oncontextmenu="markCell(this, ${i},${j})" 
            onclick="cellClicked(this, ${i},${j})">${board[i][j].isMine ? MINE : board[i][j].minesAroundCount}</button></td>`           
        }
        strHTML+='</td>'
}
tableHTML.innerHTML=strHTML

}

function renderHints(){
    strHTML=''
    var hintsHTML= document.querySelector(".hints")
    for(var i=1 ;i<=hintCount ; i++){
        strHTML+= `<p class="hint${i}" onclick="getHint(this)"><i class="fas fa-lightbulb"></i></p>`
    }
    hintsHTML.innerHTML= strHTML
}

function renderLives(){
    strHTML=''
    var firstRowDiv= document.querySelector(".lives")
    for(var i=0 ; i<livesCount ;i++){
        strHTML+=`<p class="life"><i class="fas fa-heart"></i></p>`
    }
    firstRowDiv.innerHTML=strHTML
}

function getColor(board,i,j){
    var color;
    if(board[i][j].minesAroundCount===0)color='white'
    if(board[i][j].minesAroundCount===1)color='green'
    if(board[i][j].minesAroundCount===2)color='blue'
    if(board[i][j].minesAroundCount===3)color='red'
    if(board[i][j].minesAroundCount===4)color='brown'
    if(board[i][j].minesAroundCount===5)color='yellow'
    return color

}


function markCell(elCell ,i ,j){

    if(gameDone)return
    var cell=gBoard[i][j]

    if(cell.isShown===false){
        if(cell.isMine && cell.isShown)return
    
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
isGameWon()
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
    gameDone=true
    restartHTML.innerHTML='🤯'
}

function isGameWon(){
    
    var countFlaggedMines=0
    var countCorrect=0
    var countCells=0

    for (var i=0 ;i<gBoard.length ;i++){
        for(var j=0 ;j<gBoard.length ;j++){
            var cell= gBoard[i][j]
            if(cell.isMarked && cell.isMine)countFlaggedMines++
            if(cell.isMine && cell.isShown)countFlaggedMines++
            if(!cell.isMine && cell.isShown )countCorrect++
            countCells++  
        }
    }  
    console.log(countFlaggedMines);
    console.log(countCorrect);
    console.log(countCells);
    if(countFlaggedMines===gLevel.MINES && countCorrect===countCells-countFlaggedMines){
       restartHTML.innerHTML='🤩'
       winSound.play()
       gameDone=true
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
    if(gameDone)return
    if(hint)return
    elHint.innerHTML='<i class="far fa-sun"></i>'
    elHint.style.color='white'
    hint=true     
}



function safeClick(){
    if(gameDone)return
    if(countSafeClicks===0)return

   var randomCol=Math.ceil(Math.random()*gBoard.length-1)
   var randomRow=Math.ceil(Math.random()*gBoard.length-1)

   while(gBoard[randomCol][randomRow].isMine===true || gBoard[randomCol][randomRow].isShown===true){
    randomCol=Math.ceil(Math.random()*gBoard.length-1)
    randomRow=Math.ceil(Math.random()*gBoard.length-1)
   }
   var elCell= document.querySelector(`.row${randomCol}-col${randomRow}`)
   if(gBoard[randomCol][randomRow].isMine===false){ 
    elCell.classList.add("safe-to-click")
    countSafeClicks--
   }
    gSetTimeout=setTimeout(function(){
        elCell.classList.remove("safe-to-click")
    },1000)
   
   document.querySelector(".safe").innerHTML=`SAFE ${countSafeClicks}`
    
}


