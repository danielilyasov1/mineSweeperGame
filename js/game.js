"use strict";

document.addEventListener("contextmenu", (event) => event.preventDefault());
var elTime = document.querySelector(".time");
var elFlag = document.querySelector(".flag-count");
var elEmoji = document.querySelector(".emoji");
var elLive = document.querySelector(".lives-count");
var elMine = document.querySelector(".mines-count");

const EMPTY = "";
const MINE = "🧨";
const FLAG = "🚩";
const LIFE = "💖";
const EMOJI = "🤫";
const LOSE = "😵";
const WIN = "😇";

var gLevel = {
  size: 4,
  mines: 2,
};

var gBoard;
var gBoomCount = 0;
var gTimeInterval = null;

var gGame = {
  isOn: true,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
  flagCount: 0,
  lives: 3,
};

function level1() {
  gLevel.size = 4;
  gLevel.mines = 2;
  newGame();
}

function level2() {
  gLevel.size = 8;
  gLevel.mines = 12;
  newGame();
}

function level3() {
  gLevel.size = 12;
  gLevel.mines = 30;
  newGame();
}

function init() {
  gBoard = buildBoard();
  gGame.isOn = true;

  elMine.innerText = gLevel.mines;
  elFlag.innerText = gGame.flagCount;
  elLive.innerText = gGame.lives;
  elTime.innerText = gGame.secsPassed;
  elEmoji.innerText = EMOJI;
  
  renderBoard(gBoard);
}

function newGame() {
  clearInterval(gTimeInterval);
  elEmoji.style.background = "lightgray";

  gBoomCount = 0;
  gGame.secsPassed = 0;
  gGame.markedCount = 0;
  gGame.flagCount = 0;
  gGame.shownCount = 0;
  gGame.lives = 3;

  

  init();
}

function gameOver() {
  gGame.isOn = false;
  clearInterval(gTimeInterval);
}

function buildBoard() {
  var board = createBoard(gLevel.size);

  //random mines
  for (var i = 0; i < gLevel.mines; i++) {
    var iRand = rand(0, gLevel.size);
    var jRand = rand(0, gLevel.size);
    board[iRand][jRand].isMine = true;
  }

  setMinesNegsCount(board);
  return board;
}

function renderBoard() {
  var strHTML = "";

  for (var i = 0; i < gLevel.size; i++) {
    strHTML += "<tr>\n";

    for (var j = 0; j < gLevel.size; j++) {
      var currCell = gBoard[i][j];

      var onBoard = currCell.isMine ? MINE : currCell.minesAroundCount;
      var classList = currCell.isShown ? "shown" : "hidden";

      strHTML += `<td id="cell-${i}-${j}" class="cell ${classList}"
      oncontextmenu="cellMarked(this,${i},${j},event)"
      onClick="cellClicked(this,${i},${j},event)" >
      ${currCell.isShown ? onBoard : currCell.isMarked ? FLAG : EMPTY}</td>`;
    }

    strHTML += "</tr>";
  }

  var elTable = document.querySelector(".board");
  elTable.innerHTML = strHTML;
}

function setMinesNegsCount(board) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      if (board[i][j].isMine) continue;

      board[i][j].minesAroundCount = NegsCount(i, j, board);
    }
  }
}

function checkIsExpendable(i, j) {
  if (!isOnField(i, j) || gBoard[i][j].isShown) return;

  if (gBoard[i][j].isMarked) {

    gGame.flagCount--;
    gGame.markedCount--;
    elFlag.innerText = gGame.markedCount;

  }

  gGame.shownCount++;
  expandShown(i, j);
}

function expandShown(i, j) {

  var cell = gBoard[i][j];

  if (cell.isMine) return;
  cell.isShown = true;

  renderBoard();

  if (cell.minesAroundCount === EMPTY) {

    checkIsExpendable(i, j - 1);
    checkIsExpendable(i, j + 1);
    checkIsExpendable(i + 1, j + 0);
    checkIsExpendable(i + 1, j - 1);
    checkIsExpendable(i + 1, j + 1);
    checkIsExpendable(i - 1, j + 0);
    checkIsExpendable(i - 1, j - 1);
    checkIsExpendable(i - 1, j + 1);
  }
}

function cellClicked(elCell, i, j) {
  var cell = gBoard[i][j];

  if (!gGame.isOn || cell.isShown) return;

  if (gGame.secsPassed === 0) {
    startTimer();
  }

  if (cell.isMarked) {
    console.log("gi");
    return;

  } else {
    cell.isShown = true;

    if (cell.minesAroundCount === EMPTY) {
      expandShown(i, j);
    }

    if (cell.isMine) {
      // boom
      gBoomCount++;
      gGame.lives--;
      elLive.innerText = gGame.lives;
   
    } else {
      cell.isShown = true;
      gGame.shownCount++;
    }
  }

  renderBoard();
  checkGameOver();
}

function cellMarked(elCell, i, j) {
  var cell = gBoard[i][j];

  if (gGame.secsPassed === 0) startTimer();

  if (!gGame.isOn) return;

  if (!cell.isShown) {
  
    if (!cell.isMarked) {
  
      if (gGame.markedCount === gLevel.mines) return;

      elCell.innerText = FLAG;
      gGame.markedCount++;
      cell.isMarked = true;
  
    } else {
      elCell.innerText = EMPTY;
      gGame.markedCount--;
      cell.isMarked = false;
    }

    elFlag.innerText = gGame.markedCount;

    if (cell.isMine && cell.isMarked) {
      gGame.flagCount++;
      elCell.innerText = FLAG;
    }
  }

  checkGameOver();
}

function checkGameOver() {
 
  if (gGame.lives === 0) {
    //game over
    elEmoji.innerText = LOSE;
    elEmoji.style.background = "darkgray";

    gameOver();
    return;
  }

  if ((gGame.flagCount === gLevel.mines &&
      gGame.shownCount === gLevel.size ** 2 - gLevel.mines) ||
      (gGame.shownCount === gLevel.size ** 2 - gLevel.mines &&
      gBoomCount === gLevel.mines &&
      gGame.lives !== 0)) {
    //win
    elEmoji.innerText = WIN;
    elEmoji.style.background = "darkgray";
    gameOver();
    return;
  }
}
