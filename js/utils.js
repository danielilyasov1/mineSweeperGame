function startTimer() {
  var startTime = Date.now();
  ginterval = setInterval(() => {
    gGame.secsPassed++
    var elTime = document.querySelector(".time");
    elTime.innerText = ((Date.now() - startTime) / 1000).toFixed(1);
  }, 24);
}

function createBoard(size) {
  var board = [];
  for (var i = 0; i < size; i++) {
    board[i] = [];
    for (var j = 0; j < size; j++) {
      board[i].push("");
    }
    board.push(board[i]);
  }
  return board;
}

function NegsCount(cellI, cellJ, gBoard) {
  //need fix last line in board ?????
  var mineNegsCount = 0;

  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= gLevel.size) continue;

    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j >= gLevel.size) continue;
      if (i === cellI && j === cellJ) continue;
      //if ((i !== cellI || j !== cellJ) && gBoard[i][j].isMine) mineNegsCount++;
      //console.log("mineNegsCount",i,j, mineNegsCount,gBoard[i][j].isMine);
      if (gBoard[i][j].isMine) mineNegsCount++;
    }
  }
  //console.log("hi");
  return mineNegsCount;
}
