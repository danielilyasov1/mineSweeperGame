function startTimer() {
  var startTime = Date.now();
  gTimeInterval = setInterval(() => {
    gGame.secsPassed++;
    var elTime = document.querySelector(".time");
    elTime.innerText = ((Date.now() - startTime) / 1000).toFixed(1);
  }, 24);
}

function createBoard(size) {
  var board = [];
  for (var i = 0; i < size; i++) {
    board[i] = [];
    for (var j = 0; j < size; j++) {
      board[i][j] = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
      };
    }
  }
  return board;
}

function NegsCount(cellI, cellJ, board) {
  var mineNegsCount = 0;

  if (isCellMine(cellI, cellJ - 1, board)) mineNegsCount++;
  if (isCellMine(cellI, cellJ + 1, board)) mineNegsCount++;
  if (isCellMine(cellI + 1, cellJ + 0, board)) mineNegsCount++;
  if (isCellMine(cellI + 1, cellJ - 1, board)) mineNegsCount++;
  if (isCellMine(cellI + 1, cellJ + 1, board)) mineNegsCount++;
  if (isCellMine(cellI - 1, cellJ + 0, board)) mineNegsCount++;
  if (isCellMine(cellI - 1, cellJ - 1, board)) mineNegsCount++;
  if (isCellMine(cellI - 1, cellJ + 1, board)) mineNegsCount++;

  if (mineNegsCount === 0) {
    mineNegsCount = EMPTY;
  }
  return mineNegsCount;
}

function isOnField(i, j) {
  return i >= 0 && i < gLevel.size && j >= 0 && j < gLevel.size;
}

function isCellMine(i, j, board) {
  if (!isOnField(i, j)) return;
  return board[i][j].isMine;
}

function rand(min, max){
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min)
}