//game js

//TODO: V initGame() -This is called when page loads;
//TODO: V buildBoard() -
//* Builds the board                V
//* Set mines at random locations   V
//* Call setMinesNegsCount()        V
//* Return the created board        V
//TODO: V setMinesNegsCount(board) -Count mines around each cell and set the cell's minesAroundCount;
//TODO: V renderBoard(board)  -Render the board as a <table> to the page;   
//TODO: V cellClicked(elCell, i, j)  -Called when a cell (td) is clicked;
//TODO: V cellMarked(elCell)  -Called on right click to mark a cell (suspected to be a mine) Search the web (and implement) how to hide the context menu on right click;
//TODO: V checkGameOver()  -Game ends when all mines are marked, and all the other cells are shown;
//TODO: expandShown(board, elCell,i, j) -When user clicks a cell with no mines around, we need to open not only that cell, but also its neighbors;
//TODO: the global object variables: gBoard, gLevel, gGame;
// debugger;
var watch = new timer();//evry thing that happen in timer() will be given to the new function
var gameMusic; //background music
var gLevel=gameLevel(); //now on level1 {SIZE: 4, MINES: 2,life:0}
console.log('game level:', gLevel);
var MINE = '💣';
var FLAG = '🚩'
var LIFE = 3;
var HINTS = 3;
var nextIdx = 1;
var cellId = 1;
var gMainRandomPlaces = [];
var gCheckNeighborIfZero = [];
var gFirstClickCell;
var gCheck
var gBoard;
// var gBoard = buildBoard(gLevel.MINES,gLevel.SIZE);
// console.table(gBoard);
// renderTheBoard(gBoard);
var countMines = 0;
var countShown = 0;
var countNumCells = 0;
var countMark = 0;
var gGame = {
    isOn: false,
    shownCount: countNumCells,
    markedCount: 0,
    secsPassed: 0
}
var elOverlay = document.querySelector('.overlay');
var elModal = document.querySelector('#modal');

var elCard1 = document.querySelector('#card1');
var elCard2 = document.querySelector('#card2');
var elCard3 = document.querySelector('#card3');
var elCard4 = document.querySelector('#card4');





//----------------------------------- end of main ------------------------------------------------------------------------------------
function openModal(){
    if(elModal==null)return
    elModal.classList.add('active');
    elOverlay.classList.add('active')
}

function closeModal(){
    if(elModal==null)return
    elModal.classList.remove('active');
    elOverlay.classList.remove('active')
}

//This is called when page loads:
function initGame() {
    openModal();
    watch.reset();
    // document.querySelector('.shown-count').innerHTML = gGame.shownCount;
    document.querySelector('.shown-count').innerHTML = countNumCells;
    gBoard = buildBoard(gLevel.MINES, gLevel.SIZE);
    console.table(gBoard);
    renderTheBoard(gBoard);
    gGame.isOn = true
    gameMusic = new sound("Crash.mp3");//*not working
    gameMusic.play();
    // restart();
}

function restart() {
    // openModal();
    LIFE = 3;
    HINTS = 3;
    nextIdx = 1;
    cellId = 1;
    gMainRandomPlaces = [];
    gBoard;
    countMines = 0;
    countShown = 0;
    countNumCells = 0;
    countMark = 0;
    gGame = {
        isOn: false,
        shownCount: countNumCells,
        markedCount: 0,
        secsPassed: 0
    }

    document.querySelector('.game-over').style.display = 'none';
    document.querySelector('.victory').style.display = 'none';
    // document.querySelector('.victory').style.visibility= 'hidden';
    var timer1 = document.querySelector('.timer');
    timer1.innerHTML = '00 : 00 . 000';
    // watch.reset();
    document.querySelector('.play-again').innerHTML = '😀';

    // var element = document.getElementsByClassName("hints");
    // element.style.opacity = '100%';
    document.querySelector('.shown-count').innerHTML = countNumCells;
    gBoard = buildBoard(gLevel.MINES, gLevel.SIZE);
    console.table(gBoard);
    renderTheBoard(gBoard);
    gGame.isOn = true
    initGame();
}


//Render the board as a <table> to the page:
function renderTheBoard(board) {
    // debugger;
    var strHTML = '';
    for (var i = 0; i < gLevel.SIZE; i++) {
        strHTML += '<tr class="tr" >'
        for (var j = 0; j < gLevel.SIZE; j++) {
            var cell = board[i][j];
            var id = cellId++
            if (cell.isShown === true) {
                if (cell.isMine === true) {
                    cell = MINE;
                    // LIFE--;   //*
                    console.log('life left:', LIFE)
                    gameOver();
                } else if (cell.minesAroundCount === 0) {
                    cell = ' ';
                    checkGameOver();
                } else {
                    cell = cell.minesAroundCount;
                    checkGameOver();
                }
            } else if (cell.isMarked === true) {
                cell = FLAG;
            } else {
                cell = " ";
            }
            strHTML += `<td class="td-hidden" id="${id}" onclick="shown(this,${i},${j})" oncontextmenu="cellMarkedToggle(event,this,${i},${j})">${cell}</td>`
        }
        strHTML += '</tr>'
    }
    var elBoardGame = document.querySelector('.board-game');
    elBoardGame.innerHTML = strHTML;
}

function buildBoard(mineCount, len) { //Builds the board ..
    var board = [];
    var cell;
    for (var i = 0; i < len; i++) {
        board[i] = [];
        for (var j = 0; j < len; j++) {
            cell = createCellObject();
            board[i][j] = cell;
            
        }
    }
    return board;
}
function buildBoardPlacingMinesAndNibers(mineCount, len){

    // var rRow = getRandomInt(0, len);
    // var rColl = getRandomInt(0, len);
    // var rowColl = {
    //     row: rRow,
    //     coll: rColl
    // };
    // console.log(rowColl);
    // gMainRandomPlaces.push(rowColl);
    // gBoard[rRow][rColl].isMine = true;
    console.log('gMainRandomPlaces', gMainRandomPlaces);
    for (var i = 0; i < mineCount; i++) { //Set mines at random locations
        // debugger;
        var isNotMineCoor = true;
        while (isNotMineCoor) {
            isNotMineCoor = false;
            rRow = getRandomInt(0, len);
            rColl = getRandomInt(0, len);
            rowColl = {
                row: rRow,
                coll: rColl
            };

            for (var j = 0; j < gMainRandomPlaces.length; j++) {
                if (rowColl.row === gMainRandomPlaces[j].row && rowColl.coll === gMainRandomPlaces[j].coll) {
                    isNotMineCoor = true;
                    // rRow = getRandomInt(0,len);
                    // rColl = getRandomInt(0,len);
                }
            }
            if (!isNotMineCoor) {
                gMainRandomPlaces.push(rowColl);
                gBoard[rRow][rColl].isMine = true;
                // gBoard[rRow][rColl].minesAroundCount = 'M';
                // countMines++
                // console.log(countMines)
            }
        }
    }
    setMinesNegsCount(len);
}

function createCellObject() {
    var cell = {
        id:nextIdx++,
        minesAroundCount: '', //the number of mines around the cells sown as a number
        isShown: false, //if alredy was clicked on
        isMine: false,
        isMarked: false, //of I put a Flag on it
        isCheckedExpansion: false
    }
    return cell;
}

//Count mines around each cell and set the cell's minesAroundCount
function setMinesNegsCount(len) {
    // debugger;
    var currCell;
    var count;
    var currNeighborCell;
    for (var i = 0; i < len; i++) {
        for (var j = 0; j < len; j++) {
            count = 0;
            currCell = gBoard[i][j];
            for (var x = (i - 1); x <= (i + 1); x++) {
                for (var y = (j - 1); y <= (j + 1); y++) {
                    if (x >= 0 && y >= 0 && x < len && y < len && (!(x === i && y === j))) {
                        currNeighborCell = gBoard[x][y]
                        if (currNeighborCell.isMine === true) {
                            count++;
                        }
                    }
                }
            }
            currCell.minesAroundCount += count
            console.log('currCell', count);
        }
    }
}
// var gCheckNeighborIfZero = [];
// gFirstClickCell = {
//     row: rowIdx,
//     coll: collIdx
// }
// isCheckedExpansion

function openNeighbors(){
    // debugger;
    gBoard[gCheckNeighborIfZero[0].row][gCheckNeighborIfZero[0].coll].isCheckedExpansion = false;
    while(gCheckNeighborIfZero.length > 0){
        var i=gCheckNeighborIfZero[0].row;
        var j=gCheckNeighborIfZero[0].coll;

        // var cell = gBoard[i][j];
        // gBoard[i][j].isCheckedExpansion = true;

        for (var x = (i - 1); x <= (i + 1); x++) {
            for (var y = (j - 1); y <= (j + 1); y++) {
                if (x >= 0 && y >= 0 && x < gLevel.SIZE && y < gLevel.SIZE && (!(x === i && y === j))) {
                    var neighbor =  {
                            row: x,
                            coll: y
                        }
                    if(gBoard[x][y].minesAroundCount==='0'&& gBoard[x][y].isMine !== true){
                        // countNumCells++;
                        if(gBoard[x][y].isCheckedExpansion===false){
                            gBoard[x][y].isShown=true;
                            countNumCells++;
                            gCheckNeighborIfZero.push(neighbor);
                            gBoard[x][y].isCheckedExpansion=true;
                        }
                    }else if((gBoard[x][y].minesAroundCount === '1' || gBoard[x][y].minesAroundCount === '2' || gBoard[x][y].minesAroundCount === '3')&&(gBoard[x][y].isMine !== true)){
                        if(gBoard[x][y].isCheckedExpansion===false){
                            gBoard[x][y].isShown=true;
                            countNumCells++;
                            gBoard[x][y].isCheckedExpansion=true;
                        }
                    }
                }
            }
        }
        gCheckNeighborIfZero.splice(0,1);
    }
    console.log("count of nighbors ", countNumCells);
    renderTheBoard(gBoard);

}

function gameLevel(le){
    var level1 = { 
        SIZE: 4,
        MINES: 2
        
    };
    var level2 = {
        SIZE: 8,
        MINES: 12
        
    };
    var level3 = {
        SIZE: 12,
        MINES: 30
        
    };
    switch(le){
        case 1:
            gLevel = level1;
            document.querySelector('.game-over').style.display = 'none';
            document.querySelector('.victory').style.display = 'none';
            // initGame();
            restart();
        case 2:
            gLevel = level2;
            document.querySelector('.game-over').style.display = 'none';
            document.querySelector('.victory').style.display = 'none';
            // initGame();
            restart();
        case 3:
            gLevel = level3;
            document.querySelector('.game-over').style.display = 'none';
            document.querySelector('.victory').style.display = 'none';
            // initGame();
            restart();
        default:
            return level1;
    }
}


//Getting a random integer between two values:
//the next integer greater than min if min isn't an integer,
//and is less than max.
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
//**************************************************************************************** */
function shown(btn,rowIdx, collIdx) {
    // var elTd = document.getElementById((4 * rowIdx + (collIdx + 1)).toString());  //** */
    // elTd.classList.add("td-shown");
    if (gGame.isOn) {
        // var elTd = document.getElementById((4 * rowIdx + (collIdx + 1)).toString());  //** */
        // elTd.classList.add("td-shown");
        gBoard[rowIdx][collIdx].isShown = true;
    
        if(gBoard[rowIdx][collIdx].isMine === true){
            LIFE--;
            var elLife = document.querySelectorAll('.lives');
            elLife[LIFE].innerHTML = '💔';
            // var elLife = document.querySelectorAll('.lives');
            // elLife[LIFE].innerHTML = '💔';
            // elLife[LIFE].classList.add(`life${LIFE}`);
            // elLife[LIFE].classList.add(`life${LIFE}-end`);
        }else{   //** */
            countNumCells++;
            // console.log('btn.id',btn.id);
        }

        // gBoard[rowIdx][collIdx].isShown = true;
        // countNumCells++;
        // btn.classList.remove("td-hidden");
        // btn.classList.add("td-shown");
        document.querySelector('.shown-count').innerHTML = countNumCells;
        console.log(countNumCells);
        if(countNumCells===1){
            watch.start();
            var rowColl = {
                row: rowIdx,
                coll: collIdx
            };
            gFirstClickCell = rowColl;
            gCheckNeighborIfZero.push(gFirstClickCell);
            gMainRandomPlaces.push(rowColl)
            buildBoardPlacingMinesAndNibers(gLevel.MINES, gLevel.SIZE);
            openNeighbors();
        }
        // elTd.classList.replace("td-hidden", "td-shown");
        renderTheBoard(gBoard);
        
    }
}


function cellMarkedToggle(ev, btn,rowIdx, collIdx) {
    ev.preventDefault();
    if (gGame.isOn) {
        if (btn.isMarked) {
            gBoard[rowIdx][collIdx].isMarked=false;
            countMark --;
            document.querySelector('.marked-count').innerHTML = countMark;
            btn.isMarked = false;
            btn.innerHTML = ' ';
            console.log(btn.isMarked);
        } else {
            gBoard[rowIdx][collIdx].isMarked=true;
            countMark ++;
            document.querySelector('.marked-count').innerHTML = countMark;
            btn.isMarked = true;
            btn.innerHTML = FLAG;
            console.log(btn.isMarked);
        }
    }
}


function gameOver() {
    if(LIFE!==0){   //* adding lives to the game 
        return;
    }
    // var elLife = document.querySelectorAll('.lives');
    // elLife[LIFE].style.opacity = '0';
    console.log('Game Over');
    watch.stop();
    gGame.isOn = false;
    var elGameOver = document.querySelector('.game-over');
    elGameOver.style.display = 'inline';
    document.querySelector('.play-again').innerHTML = '😵';
}

function checkGameOver() {
    if (countNumCells === (gLevel.SIZE**2 - gLevel.MINES)) {
        console.log('victory');
        watch.stop();
        gGame.isOn=false;
        document.querySelector('.victory').style.display = 'inline';
        // document.querySelector('.victory').style.visibility= 'visible';
        document.querySelector('.play-again').innerHTML = '🤩';
    }
}


function showHint(btn,e){
    e.preventDefault;
    // btn.style.animation= 'fade 2s forwards';
    btn.classList.add('run-animation');
}


function timer(){
    var time = 0; //the current time in milisec
    var interval; //so it will keep running
    var offset; //the current time when start

    function update(){
        time += delta();
        var formattedTime = timeFormatter(time);
        // console.log(formattedTime);
    }
    function delta(){//calc how much time passed
        var now = Date.now();
        var timePassed = now - offset;
        offset = now;
        return timePassed;
    }
    function timeFormatter(timeInMilliseconds){
        var time = new Date(timeInMilliseconds);
        var minutes = time.getMinutes().toString();
        var seconds = time.getSeconds().toString();
        var milliseconds = time.getMilliseconds().toString();

        if(minutes.length<2){
            minutes = '0' + minutes;
        }
        if(seconds.length<2){
            seconds = '0' + seconds;
        }
        while(milliseconds.length<3){
            milliseconds = '0' + milliseconds;
        }
        var timer1 = document.querySelector('.timer');
        timer1.innerHTML = minutes + ' : ' + seconds + ' . ' + milliseconds;
        return minutes + ' : ' + seconds + ' . ' + milliseconds;
    }

    this.isOn = false; //if the watch is running
    this.start = function(){
        console.log('watch is starting');
        if(!this.isOn){
            interval = setInterval(update, 10)//evey 10 milisec
            offset = Date.now();
            this.isOn = true;
        }
    }
    this.stop = function(){
        if(this.isOn){
            clearInterval(interval);
            interval  = null;
            this.isOn = false;
        }
    }
    this.reset = function(){
        time = 0;
    }
}

function gameStyle(hero){
    // debugger;
    var elhints = document.querySelectorAll('.hints');
    var elLives = document.getElementsByClassName('lives');
    var elPlayAgain =document.querySelector('.play-again');
    var elGameBody = document.querySelector('.game-body');
    var style;
    switch(hero){
        case 1:
            style = {
                hints: elhints[0].innerHTML='🧪',
                hints: elhints[1].innerHTML='🧪',
                hints: elhints[2].innerHTML='🧪',
                life: elLives[0].innerHTML = '🧠',
                life: elLives[1].innerHTML = '🧠',
                life: elLives[2].innerHTML = '🧠',
                btn: elPlayAgain.innerHTML='🛸',
                back: elGameBody.style.backgroundImage='linear-gradient(to right bottom, rgb(255, 91, 91), rgb(69, 159, 173 , 71%), rgb(70 110 70), rgb(21, 77, 21))',
                txt: elGameBody.style.color='black'
            };
            return style;
        case 2:
            style = {
                hints: elhints[0].innerHTML='🪓',
                hints: elhints[1].innerHTML='🪓',
                hints: elhints[2].innerHTML='🪓',
                life: elLives[0].innerHTML = '❤️',
                life: elLives[1].innerHTML = '❤️',
                life: elLives[2].innerHTML = '❤️',
                btn: elPlayAgain.innerHTML='🎙️',/*'🎤''🤑'*/
                back: elGameBody.style.backgroundImage='linear-gradient(to right bottom, rgb(62 31 0), rgb(26 52 73), rgb(49 88 113), rgb(119 119 119))',
                txt: elGameBody.style.color='white'
            };
            return style;
        case 3:
            style = {
                    hints: elhints[0].innerHTML='🎂',/*🎁 🧁*/
                    hints: elhints[1].innerHTML='🎂',/*🎁 🧁*/
                    hints: elhints[2].innerHTML='🎂',/*🎁 🧁*/
                    life: elLives[0].innerHTML = '💝',
                    life: elLives[1].innerHTML = '💝',
                    life: elLives[2].innerHTML = '💝',
                    btn: elPlayAgain.innerHTML='🥀',
                    back: elGameBody.style.backgroundImage='linear-gradient(to bottom right, rgb(255, 240, 85), rgb(79 ,196, 255), rgb(255, 151, 237),rgb(232, 59 ,203))',
                    txt: elGameBody.style.color='black'
            }
            return style;
        case 4:
            style = {
                hints: elhints[0].innerHTML='💡',
                hints: elhints[1].innerHTML='💡',
                hints: elhints[2].innerHTML='💡',
                life1: elLives[0].innerHTML = '💗',
                life2: elLives[1].innerHTML = '💗',
                life3: elLives[2].innerHTML = '💗',
                btn: elPlayAgain.innerHTML='👑',
                back: elGameBody.style.backgroundImage='linear-gradient(rgb(255, 147, 201), rgb(201, 134, 255), rgb(169, 249, 255))',
                // back: elGameBody.style.backgroundImage='url("../imgs/back-g/backg-me.jpg")',
                txt: elGameBody.style.color='white'
            }
            return style;
    }

}




//     var rRow = getRandomInt(0, len);
//     var rColl = getRandomInt(0, len);
//     var rowColl = {
//         row: rRow,
//         coll: rColl
//     };
//     console.log(rowColl);
//     gMainRandomPlaces.push(rowColl);
//     board[rRow][rColl].isMine = true;
//     console.log('gMainRandomPlaces', gMainRandomPlaces);
//     for (var i = 1; i < mineCount; i++) { //Set mines at random locations
//         // debugger;
//         var isNotMineCoor = true;
//         while (isNotMineCoor) {
//             isNotMineCoor = false;
//             rRow = getRandomInt(0, len);
//             rColl = getRandomInt(0, len);
//             rowColl = {
//                 row: rRow,
//                 coll: rColl
//             };

//             for (var j = 0; j < gMainRandomPlaces.length; j++) {
//                 if (rowColl.row === gMainRandomPlaces[j].row && rowColl.coll === gMainRandomPlaces[j].coll) {
//                     isNotMineCoor = true;
//                     // rRow = getRandomInt(0,len);
//                     // rColl = getRandomInt(0,len);
//                 }
//             }
//             if (!isNotMineCoor) {
//                 gMainRandomPlaces.push(rowColl);
//                 board[rRow][rColl].isMine = true;
//                 // countMines++
//                 // console.log(countMines)
//             }
//         }
//     }
//     bored = setMinesNegsCount(board, len);
//     return board;
// }


// function setMinesNegsCount(board, len) {
//     // debugger;
//     var currCell;
//     var count;
//     var currNeighborCell;
//     for (var i = 0; i < len; i++) {
//         for (var j = 0; j < len; j++) {
//             count = 0;
//             currCell = board[i][j];
//             for (var x = (i - 1); x <= (i + 1); x++) {
//                 for (var y = (j - 1); y <= (j + 1); y++) {
//                     if (x >= 0 && y >= 0 & x < len && y < len && (!(x === i && y === j))) {
//                         currNeighborCell = board[x][y]
//                         if (currNeighborCell.isMine === true) {
//                             count++;
//                         }
//                     }
//                 }
//             }
//             currCell.minesAroundCount += count
//             console.log('currCell', count);
//         }
//     }
//     return board;
// }
//