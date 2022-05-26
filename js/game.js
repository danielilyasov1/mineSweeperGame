"use strict";

document.addEventListener("contextmenu", (event) => event.preventDefault());

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
  init();
}
function level2() {
  gLevel.size = 8;
  gLevel.mines = 12;
  init();
}
function level3() {
  gLevel.size = 12;
  gLevel.mines = 30;
  init();
}

function init() {
  gBoard = buildBoard();
  gGame.isOn = true;
  renderBoard(gBoard);
  document.querySelector(".mines-count").innerText = gLevel.mines;
  document.querySelector(".flag-count").innerText = gGame.flagCount;
  var elTime = document.querySelector(".time");
  elTime.innerText = gGame.secsPassed;
  document.querySelector(".emoji").innerText = EMOJI;
}
function newGame() {
  clearInterval(gTimeInterval);
  gBoomCount = 0;
  gGame.secsPassed = 0;
  gGame.markedCount = 0;
  gGame.flagCount = 0;
  gGame.shownCount = 0;
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
      ${currCell.isShown ? onBoard : EMPTY}</td>`;
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

function expandShown(elCell, i, j) {
  if (
    !isOnField(i, j) ||
    gBoard[i][j].minesAroundCount !== 0 ||
    gBoard[i][j].isShown
  )
    return;

  gBoard[i][j].isShown = true;
  renderBoard();
}

function cellClicked(elCell, i, j) {
  if (gGame.secsPassed === 0) {
    startTimer();
  }

  gBoard[i][j].isShown = true;

  if (elCell.minesAroundCount === 0) {
    expandShown(elCell, i, j);
  }
  renderBoard();

  if (gBoard[i][j].isMine) {
    console.log("boom");
    gBoomCount++;
  } else {
    elCell.isShown = true;
    gGame.shownCount++;
  }
  checkGameOver();
}

function cellMarked(elCell, i, j) {
  if (gGame.secsPassed === 0) startTimer();

  var cell = gBoard[i][j];

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

    if (cell.isMine && cell.isMarked) {
      gGame.flagCount++;
      document.querySelector(".flag-count").innerText = gGame.flagCount;
    }
  }

  checkGameOver();
}

function checkGameOver() {
  if (gBoomCount > 0) {
    ///=== gLevel.mines

    document.querySelector(".emoji").innerText = LOSE;
    document.querySelector(".emoji").style.background = "darkgray";
    console.log("game over");

    gameOver();
    return;
  }

  if (
    gGame.flagCount == gLevel.mines &&
    gGame.shownCount === gLevel.size ** 2 - gLevel.mines
  ) {
    console.log("gret");
    document.querySelector(".emoji").innerText = WIN;
    document.querySelector(".emoji").style.background = "darkgray";
    gameOver();
    return;
  }
}
