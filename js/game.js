"use strict";
const EMPTY = "";
const MINE = "🧨";
const FLAG = "🚩";
const LIFE = "💖";

var gLevel = {
  size: 4,
  mines: 2,
};

var gBoard;
var gBoomCount = 0;

var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
  lives : 3,
};

function init() {
  gBoard = buildBoard();
  renderBoard(gBoard);

}

function gameOver(){
  
}
//var c = setMinesNegsCount(gBoard[1], gBoard[1], gBoard);
//console.log("c", c);

function buildBoard() {
  var board = createBoard(gLevel.size);

  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      var cell = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
      };

      //   if (cell.isMine === true) {
      //     board[i][j] = MINE;
      //   } else {
      // board[i][j] = EMPTY;
      //   }
      board[i][j] = cell; //setMinesNegsCount(i,j,gBoard);
    }
  }
  //board[1][1].isShown = true;

  //board[0][1].isMine = true; // = MINE;
  board[1][1].isMine = true; // = MINE;
  //board[3][2].isMine = true; // = MINE;
  board[2][1].isMine = true; // = MINE;
  //console.log('board',board)
  setMinesNegsCount(board);
  return board;
}

function renderBoard() {
  var strHTML = "";
  for (var i = 0; i < gLevel.size; i++) {
    strHTML += "<tr>\n";
    for (var j = 0; j < gLevel.size; j++) {
      var currCell = gBoard[i][j];
      var onBoard = currCell.isMine ? MINE : currCell.minesAroundCount; //=== 0 ? EMPTY : currCell.minesAroundCount;
      //if(currCell.isMine === false && currCell.minesAroundCount === 0) onBoard = EMPTY
      var classList = currCell.isShown ? "shown" : "hidden";
      strHTML += `<td id="cell-${i}-${j}" class="cell ${classList}" 
      onClick="cellClicked(this,${i},${j})">
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
      console.log("board[i][j].minesAroundCount", board[i][j].minesAroundCount);
    }
  }
}

function cellClicked(elCell, i, j) {
  console.log("click");
  var clickedCell = gBoard[i][j];

  clickedCell.isShown = true;

  renderBoard();
  if (clickedCell.isMine) {
    console.log("boom");
    gBoomCount++;
    console.log("gBoomCount", gBoomCount);
  }
}

//function cellMarked(elCell)
//function checkGameOver() ///if gBoomCount === life =>gGame.isOver
//function expandShown(board, elCell, i, j)
