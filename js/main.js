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

var watch = new timer();//evry thing that happen in timer() will be given to the new function
var gLevel = gameLevel(); //now on level1 {SIZE: 4, MINES: 2}
console.log('game level:', gLevel);
var MINE = '💣';
var FLAG = '🚩'
var gMainRandomPlaces = [];
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



//----------------------------------- end of main ------------------------------------------------------------------------------------


//This is called when page loads:
function initGame() {
    watch.reset();
    document.querySelector('.shown-count').innerHTML = gGame.shownCount;
    gBoard = buildBoard(gLevel.MINES, gLevel.SIZE);
    console.table(gBoard);
    renderTheBoard(gBoard);
    gGame.isOn = true
}

function restart() {
    var timer1 = document.querySelector('.timer');
    timer1.innerHTML = '00 : 00 . 000';
    watch.reset();
    document.querySelector('.game-over').style.display = 'none';
    document.querySelector('.victory').style.display = 'none';
    document.querySelector('.play-again').style.display = 'none';
    gMainRandomPlaces = [];
    countNumCells=0;
    gGame = {
        isOn: false,
        shownCount: countNumCells,
        markedCount: 0,
        secsPassed: 0
    }
    document.querySelector('.shown-count').innerHTML = countNumCells;
    gBoard = buildBoard(gLevel.MINES, gLevel.SIZE);
    console.table(gBoard);
    renderTheBoard(gBoard);
    gGame.isOn = true
}
//Render the board as a <table> to the page:
function renderTheBoard(board) {
    // debugger;
    var strHTML = '';
    for (var i = 0; i < gLevel.SIZE; i++) {
        strHTML += '<tr class="tr" >'
        for (var j = 0; j < gLevel.SIZE; j++) {
            var cell = board[i][j];
            if (cell.isShown === true) {
                if (cell.isMine === true) {
                    cell = MINE;
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
            strHTML += `<td class="td-hidden" onclick="shown(this,${i},${j})" oncontextmenu="cellMarkedToggle(event,this,${i},${j})">${cell}</td>`
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
                // countMines++
                // console.log(countMines)
            }
        }
    }
    setMinesNegsCount(len);
}

function createCellObject() {
    var cell = {
        minesAroundCount: '', //the number of mines around the cells sown as a number
        isShown: false, //if alredy was clicked on
        isMine: false,
        isMarked: false //of I put a Flag on it
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
                    if (x >= 0 && y >= 0 & x < len && y < len && (!(x === i && y === j))) {
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

function gameLevel() {
    // var userLevel = prompt('Enter level(1-3):');
    // if(userLevel===1){
    //     var level1 = { 
    //         SIZE: 4,
    //         MINES: 2
    //     };
    //     return level1
    // }
    // if(userLevel===2){
    //     var level2 = { 
    //         SIZE: 8,
    //         MINES: 12
    //     };
    //     return level2
    // }
    // if(userLevel===3){
    //     var level3 = { 
    //         SIZE: 12,
    //         MINES: 30
    //     };
    //     return level3
    // }
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
    return level2;
    // return level2;
    // return level3;
}


//Getting a random integer between two values:
//the next integer greater than min if min isn't an integer,
//and is less than max.
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function shown(btn, rowIdx, collIdx) {
    if (gGame.isOn) {
        gBoard[rowIdx][collIdx].isShown = true;
        countNumCells++;
        document.querySelector('.shown-count').innerHTML = gGame.shownCount;
        console.log(countNumCells);
        if(countNumCells===1){
            watch.start();
            var rowColl = {
                row: rowIdx,
                coll: collIdx
            };
            gMainRandomPlaces.push(rowColl)
            buildBoardPlacingMinesAndNibers(gLevel.MINES, gLevel.SIZE);
        }
        btn.classList.remove(".td-hidden");
        btn.classList.add(".td-shown");
        renderTheBoard(gBoard);
        gGame.shownCount++;
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
    console.log('Game Over');
    watch.stop();
    gGame.isOn = false;
    var elGameOver = document.querySelector('.game-over');
    elGameOver.style.display = 'inline';
    document.querySelector('.play-again').style.display = 'inline';
}

function checkGameOver() {
    if (countNumCells === (gLevel.SIZE**2 - gLevel.MINES)) {
        console.log('victory');
        watch.stop();
        gGame.isOn=false;
        document.querySelector('.victory').style.display = 'inline';
        document.querySelector('.play-again').style.display = 'inline';
    }
}


// function showHint(rowIdx, collIdx){
//     var cell = gBoard[rowIdx][collIdx];

// }


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