//  hotkeys
function handlerFunc() {
  var x = event.keyCode;
  if (x === 83 && startToggle === 1) {
    pushDown();
  }
  else if (x === 80) {
    start();
  }
  else if (x === 65 && startToggle === 1) {
    checkMoveLeftAble();
    if (moveLeftAble === true) {
      moveLeft();
    }
  }
  else if (x === 68 && startToggle === 1) {
    checkMoveRightAble();
    if (moveRightAble === true) {
      moveRight();
    }
  }
  else if (x === 82) {
    reset();
  }
  else if (x === 87 && startToggle === 1) {
    rotateRight();
  }
}

// constants
let width = 18;
let height = 12;
let startToggle = 1;
let valueArray = [];
let gameSpeed = 350;
let score = 0;
let pieceCounter = 0;
let fallAble = true;
let moveRightAble = true;
let moveLeftAble = true;
let rotateRightAble = true;
let rotateLeftAble = true;
let level = 0;
let currentPiece;
let aspect = "A";


// array builder
function buildArray(rows, columns) {
  for (let xV = 0; xV < rows; xV++) {
    valueArray.push([]);
    for (let yV = 0; yV < columns; yV++) {
      valueArray[xV].push(["・", "colour"]);
    }
  }
}

// board draw
function drawTable(tlx, tly) {
  const container = document.querySelector('.container');
  let html = '';
  html += '<table>';
  for (let xS = 0; xS < width; xS++) {
    html += '<tr>';
    for (let yS = 0; yS < height; yS++) {
      html += '<td width=20>';
      html += valueArray[xS][yS][0];
      html += '</td>';
    }
    html += '</tr>';
  }
  html += '</table>';
  container.innerHTML = html;
  setColour();
  let points = document.querySelector('.points');
  points.innerHTML = "得点:  " + score;
  let lvlDisplay = document.querySelector('.level');
  lvlDisplay.innerHTML = "レベル　" + level;

}

//start/stop toggle (bound to 'start/stop' button)
function start() {
  if (startToggle === 0) {
    startToggle = 1;
  }
  else {
    startToggle = 0;
  }
}

// game ticks
setInterval(function () {
  if (startToggle === 1) {
    // looping functions
    score = score + 1;
    checkFallAble();
    if (fallAble === true) {
      fall();
    }
    else {
      clearLines();
      score = score + 100;
      spawnNewPiece();
      if (pieceCounter % 20 === 0) {
        levelUp();
      }
    }
    dropLines();
  }
}, gameSpeed);

// resets game
function reset() {
  width = 18;
  height = 12;
  startToggle = 1;
  valueArray = [];
  gameSpeed = 350;
  score = 0;
  pieceCounter = 0;
  fallAble = true;
  moveRightAble = true;
  moveLeftAble = true;
  rotateRightAble = true;
  level = 0;
  currentPiece = "none";
  aspect = "A";
  buildArray(width, height);
  drawTable(width, height);
  spawnNewPiece();
}


// clears full lines
function clearLines() {
  score = score + 200;
  let anyBlanks = false
  for (let i = 0; i < valueArray.length; i++) {
    for (let j = 0; j < valueArray[i].length; j++) {
      if (valueArray[i][j][0] === "・") {
        anyBlanks = true;
      }
    }
    if (anyBlanks === false) {
      for (let q = 0; q < valueArray[i].length; q++) {
        valueArray[i][q][0] = "・";
        valueArray[i][q][1] = "colour";
      }
    }
    anyBlanks = false;
  }
}

// drops the empty lines.
function dropLines() {
  let isLineClear = true
  for (let i = (valueArray.length - 1); i > 1; i--) {
    for (let j = 0; j < valueArray[i].length; j++) {
      if (valueArray[i][j][0] != "・") {
        isLineClear = false;
      }
    }
    if (isLineClear === true) {
      for (let q = 0; q < valueArray[i].length; q++) {
        if (valueArray[i - 1][q][0] != pieceCounter) {
          valueArray[i][q][0] = valueArray[i - 1][q][0];
          valueArray[i][q][1] = valueArray[i - 1][q][1];
          valueArray[i - 1][q][0] = "・";
          valueArray[i - 1][q][1] = "colour";
        }
      }
    }
    isLineClear = true;
  }
}

//checks if the moveable piece can fall:
function checkFallAble() {
  let liesCounter = 0;
  for (let i = (valueArray.length - 1); i > -1; i--) {
    for (let j = (valueArray[i].length - 1); j > -1; j--) {
      if (valueArray[i][j][0] === pieceCounter) {
        if (i === (valueArray.length - 1)) {
          liesCounter = liesCounter + 1;
        }
        else {
          if (valueArray[i + 1][j][0] === "・" || valueArray[i + 1][j][0] === pieceCounter) {
            liesCounter = liesCounter;
          }
          else {
            liesCounter = liesCounter + 1;
          }
        }
      }
    }
  }
  if (liesCounter > 0) {
    fallAble = false;
  }
  else {
    fallAble = true;
  }
}

// falls moveable piece 1 unit.
function fall() {
  for (let i = (valueArray.length - 1); i > -1; i--) {
    for (let j = (valueArray[i].length - 1); j > -1; j--) {
      if (valueArray[i][j][0] === pieceCounter) {
        valueArray[i + 1][j][0] = valueArray[i][j][0];
        valueArray[i + 1][j][1] = valueArray[i][j][1];
        valueArray[i][j][0] = "・";
        valueArray[i][j][1] = "colour";
      }
    }
  }
  drawTable(width, height);
}

//generates a random integer between min (inclusives) and max (exclusive)
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function checkEmpty(cell) {
  if (cell === "・" || cell === pieceCounter) {
    return true;
  }
  else {
    return false;
  }
}


//checks if rotation is possible. if so, rotates the current piece.
function rotateRight() {
  let attempt = 1;
  for (let i = 0; i < valueArray.length; i++) {
    for (let j = 0; j < valueArray[i].length; j++) {
      if (valueArray[i][j][0] === pieceCounter) {
        if (currentPiece === "T" && attempt === 1) {
          attempt = attempt - 1;
          if (aspect === "A") {
            if (i < 1) {
              failedRotateTrigger();
            }
            else if (checkEmpty(valueArray[i - 1][j + 1][0])) {
              valueArray[i - 1][j + 1][0] = pieceCounter;
              valueArray[i - 1][j + 1][1] = "lightGreen";
              valueArray[i][j + 2][0] = "・";
              valueArray[i][j + 2][1] = "colour";
              aspect = "B";
            }
            else {
              failedRotateTrigger();
            }
          }
          else if (aspect === "B") {
            if (j > 10) {
              failedRotateTrigger();
            }
            else if (checkEmpty(valueArray[i + 1][j + 1][0])) {
              valueArray[i + 1][j + 1][0] = pieceCounter;
              valueArray[i + 1][j + 1][1] = "lightGreen";
              valueArray[i + 2][j][0] = "・";
              valueArray[i + 2][j][1] = "colour";
              aspect = "C";
            }
            else {
              failedRotateTrigger();
            }
          }
          else if (aspect === "C") {
            if (i > 16) {
              failedRotateTrigger();
            }
            else if (checkEmpty(valueArray[i + 2][j][0])) {
              valueArray[i + 2][j][0] = pieceCounter;
              valueArray[i + 2][j][1] = "lightGreen";
              valueArray[i + 1][j - 1][0] = "・";
              valueArray[i + 1][j - 1][1] = "colour";
              aspect = "D";
            }
            else {
              failedRotateTrigger();
            }
          }
          else if (aspect === "D") {
            if (j < 1) {
              failedRotateTrigger();
            }
            else if (checkEmpty(valueArray[i + 1][j - 1][0])) {
              valueArray[i + 1][j - 1][0] = pieceCounter;
              valueArray[i + 1][j - 1][1] = "lightGreen";
              valueArray[i][j][0] = "・";
              valueArray[i][j][1] = "colour";
              aspect = "A";
            }
            else {
              failedRotateTrigger();
            }
          }
          else {
            alert("error: unknown aspect exception");
          }
        }
        else if (currentPiece === "S" && attempt === 1) {
          attempt = attempt - 1;
          if (aspect === "A") {
            if (i < 1) {
              failedRotateTrigger();
            }
            else if (checkEmpty(valueArray[i - 1][j + 1][0]) && checkEmpty(valueArray[i + 1][j][0])) {
              valueArray[i - 1][j + 1][0] = pieceCounter;
              valueArray[i - 1][j + 1][1] = "salmon";
              valueArray[i + 1][j][0] = pieceCounter;
              valueArray[i + 1][j][1] = "salmon"
              valueArray[i + 1][j + 1][0] = "・";
              valueArray[i + 1][j + 1][1] = "colour";
              valueArray[i + 1][j + 2][0] = "・";
              valueArray[i + 1][j + 2][1] = "colour";
              aspect = "B";
            }
            else {
              failedRotateTrigger();
            }
          }
          else if (aspect === "B") {
            if (j > 10) {
              failedRotateTrigger();
            }
            else if (checkEmpty(valueArray[i][j - 1][0]) && checkEmpty(valueArray[i + 1][j + 1][0])) {
              valueArray[i][j - 1][0] = pieceCounter;
              valueArray[i][j - 1][1] = "salmon";
              valueArray[i + 1][j + 1][0] = pieceCounter;
              valueArray[i + 1][j + 1][1] = "salmon"
              valueArray[i + 1][j - 1][0] = "・";
              valueArray[i + 1][j - 1][1] = "colour";
              valueArray[i + 2][j - 1][0] = "・";
              valueArray[i + 2][j - 1][1] = "colour";
              aspect = "A";
            }
            else {
              failedRotateTrigger();
            }
          }
          else {
            alert("error: unknown aspect exception");
          }

        }
        else if (currentPiece === "Z" && attempt === 1) {
          attempt = attempt - 1;
          if (aspect === "A") {
            if (i < 1) {
              failedRotateTrigger();
            }
            else if (checkEmpty(valueArray[i + 1][j + 1][0]) && checkEmpty(valueArray[i + 2][j + 1][0])) {
              valueArray[i + 1][j + 1][0] = pieceCounter;
              valueArray[i + 1][j + 1][1] = "salmon";
              valueArray[i + 2][j + 1][0] = pieceCounter;
              valueArray[i + 2][j + 1][1] = "darkOrange"
              valueArray[i][j + 1][0] = "・";
              valueArray[i][j + 1][1] = "colour";
              valueArray[i + 1][j - 1][0] = "・";
              valueArray[i + 1][j - 1][1] = "colour";
              aspect = "B";
            }
            else {
              failedRotateTrigger();
            }
          }
          else if (aspect === "B") {
            if (j < 1) {
              failedRotateTrigger();
            }
            else if (checkEmpty(valueArray[i][j + 1][0]) && checkEmpty(valueArray[i + 1][j - 1][0])) {
              valueArray[i + 1][j + 1][0] = "・";
              valueArray[i + 1][j + 1][1] = "colour";
              valueArray[i + 2][j + 1][0] = "・";
              valueArray[i + 2][j + 1][1] = "colour"
              valueArray[i][j + 1][0] = pieceCounter;
              valueArray[i][j + 1][1] = "darkOrange";
              valueArray[i + 1][j - 1][0] = pieceCounter;
              valueArray[i + 1][j - 1][1] = "darkOrange";
              aspect = "A";
            }
            else {
              failedRotateTrigger();
            }
          }
          else if (aspect === "C") {
            // N/A (isomorphin to A)
          }
          else if (aspect === "D") {
            // N/A (isomorphic to B)
          }
          else {
            alert("error: unknown aspect exception");
          }
        }
        else if (currentPiece === "L" && attempt === 1) {
          attempt = attempt - 1;
          if (aspect === "A") {
            if (i < 1) {
              failedRotateTrigger();
            }
            else if (checkEmpty(valueArray[i - 1][j][0]) && checkEmpty(valueArray[i - 1][j + 1][0]) && checkEmpty(valueArray[i + 1][j + 1][0])) {
              valueArray[i - 1][j][0] = pieceCounter;
              valueArray[i - 1][j][1] = "violet";
              valueArray[i - 1][j + 1][0] = pieceCounter;
              valueArray[i - 1][j + 1][1] = "violet"
              valueArray[i + 1][j + 1][0] = pieceCounter;
              valueArray[i + 1][j + 1][1] = "violet"
              valueArray[i][j][0] = "・";
              valueArray[i][j][1] = "colour";
              valueArray[i + 1][j][0] = "・";
              valueArray[i + 1][j][1] = "colour";
              valueArray[i][j + 2][0] = "・";
              valueArray[i][j + 2][1] = "colour";
              aspect = "B";
            }
            else {
              failedRotateTrigger();
            }
          }
          else if (aspect === "B") {
            if (j > 9) {
              failedRotateTrigger();
            }
            else if (checkEmpty(valueArray[i + 1][j][0]) && checkEmpty(valueArray[i][j + 2][0]) && checkEmpty(valueArray[i + 1][j + 1][0])) {
              valueArray[i + 1][j][0] = pieceCounter;
              valueArray[i + 1][j][1] = "violet";
              valueArray[i][j + 2][0] = pieceCounter;
              valueArray[i][j + 2][1] = "violet"
              valueArray[i + 1][j + 2][0] = pieceCounter;
              valueArray[i + 1][j + 2][1] = "violet"
              valueArray[i][j][0] = "・";
              valueArray[i][j][1] = "colour";
              valueArray[i][j + 1][0] = "・";
              valueArray[i][j + 1][1] = "colour";
              valueArray[i + 2][j + 1][0] = "・";
              valueArray[i + 2][j + 1][1] = "colour";
              aspect = "C";
            }
            else {
              failedRotateTrigger();
            }
          }
          else if (aspect === "C") {
            if (i > 14) {
              failedRotateTrigger();
            }
            else if (checkEmpty(valueArray[i][j - 1][0]) && checkEmpty(valueArray[i + 2][j - 1][0]) && checkEmpty(valueArray[i + 2][j][0])) {
              valueArray[i][j - 1][0] = pieceCounter;
              valueArray[i][j - 1][1] = "violet";
              valueArray[i + 2][j - 1][0] = pieceCounter;
              valueArray[i + 2][j - 1][1] = "violet"
              valueArray[i + 2][j][0] = pieceCounter;
              valueArray[i + 2][j][1] = "violet"
              valueArray[i][j][0] = "・";
              valueArray[i][j][1] = "colour";
              valueArray[i + 1][j][0] = "・";
              valueArray[i + 1][j][1] = "colour";
              valueArray[i + 1][j - 2][0] = "・";
              valueArray[i + 1][j - 2][1] = "colour";
              aspect = "D";
            }
            else {
              failedRotateTrigger();
            }
          }
          else if (aspect === "D") {
            if (j < 1) {
              failedRotateTrigger();
            }
            else if (checkEmpty(valueArray[i + 1][j - 1][0]) && checkEmpty(valueArray[i + 1][j + 1][0]) && checkEmpty(valueArray[i + 2][j - 1][0])) {
              valueArray[i + 1][j - 1][0] = pieceCounter;
              valueArray[i + 1][j - 1][1] = "violet";
              valueArray[i + 1][j + 1][0] = pieceCounter;
              valueArray[i + 1][j + 1][1] = "violet"
              valueArray[i + 2][j - 1][0] = pieceCounter;
              valueArray[i + 2][j - 1][1] = "violet"
              valueArray[i][j][0] = "・";
              valueArray[i][j][1] = "colour";
              valueArray[i + 2][j][0] = "・";
              valueArray[i + 2][j][1] = "colour";
              valueArray[i + 2][j + 1][0] = "・";
              valueArray[i + 2][j + 1][1] = "colour";
              aspect = "A";
            }
            else {
              failedRotateTrigger();
            }
          }
          else {
            alert("error: unknown aspect exception");
          }
        }
        else if (currentPiece === "Y" && attempt === 1) {
          attempt = attempt - 1;
          if (aspect === "A") {
            if (i < 1) {
              failedRotateTrigger();
            }
            else if (checkEmpty(valueArray[i - 1][j + 1][0]) && checkEmpty(valueArray[i + 1][j][0]) && checkEmpty(valueArray[i + 1][j + 1][0])) {
              valueArray[i - 1][j + 1][0] = pieceCounter;
              valueArray[i - 1][j + 1][1] = "lightyellow";
              valueArray[i + 1][j][0] = pieceCounter;
              valueArray[i + 1][j][1] = "lightyellow"
              valueArray[i + 1][j + 1][0] = pieceCounter;
              valueArray[i + 1][j + 1][1] = "lightyellow"
              valueArray[i][j][0] = "・";
              valueArray[i][j][1] = "colour";
              valueArray[i][j + 2][0] = "・";
              valueArray[i][j + 2][1] = "colour";
              valueArray[i + 1][j + 2][0] = "・";
              valueArray[i + 1][j + 2][1] = "colour";
              aspect = "B";
            }
            else {
              failedRotateTrigger();
            }
          }
          else if (aspect === "B") {
            if (j > 10) {
              failedRotateTrigger();
            }
            else if (checkEmpty(valueArray[i][j - 1][0]) && checkEmpty(valueArray[i + 1][j + 1][0]) && checkEmpty(valueArray[i + 1][j - 1][0])) {
              valueArray[i][j - 1][0] = pieceCounter;
              valueArray[i][j - 1][1] = "lightyellow";
              valueArray[i + 1][j - 1][0] = pieceCounter;
              valueArray[i + 1][j - 1][1] = "lightyellow"
              valueArray[i + 1][j + 1][0] = pieceCounter;
              valueArray[i + 1][j + 1][1] = "lightyellow"
              valueArray[i][j][0] = "・";
              valueArray[i][j][1] = "colour";
              valueArray[i + 2][j][0] = "・";
              valueArray[i + 2][j][1] = "colour";
              valueArray[i + 2][j - 1][0] = "・";
              valueArray[i + 2][j - 1][1] = "colour";
              aspect = "C";
            }
            else {
              failedRotateTrigger();
            }
          }
          else if (aspect === "C") {
            if (i > 15) {
              failedRotateTrigger();
            }
            else if (checkEmpty(valueArray[i][j + 1][0]) && checkEmpty(valueArray[i][j + 2][0]) && checkEmpty(valueArray[i + 2][j + 1][0])) {
              valueArray[i][j + 1][0] = pieceCounter;
              valueArray[i][j + 1][1] = "lightyellow";
              valueArray[i][j + 2][0] = pieceCounter;
              valueArray[i][j + 2][1] = "lightyellow"
              valueArray[i + 2][j + 1][0] = pieceCounter;
              valueArray[i + 2][j + 1][1] = "lightyellow"
              valueArray[i][j][0] = "・";
              valueArray[i][j][1] = "colour";
              valueArray[i + 1][j][0] = "・";
              valueArray[i + 1][j][1] = "colour";
              valueArray[i + 1][j + 2][0] = "・";
              valueArray[i + 1][j + 2][1] = "colour";
              aspect = "D";
            }
            else {
              failedRotateTrigger();
            }
          }
          else if (aspect === "D") {
            if (j < 1) {
              failedRotateTrigger();
            }
            else if (checkEmpty(valueArray[i + 1][j - 1][0]) && checkEmpty(valueArray[i + 1][j + 1][0]) && checkEmpty(valueArray[i + 2][j + 1][0])) {
              valueArray[i + 1][j + 1][0] = pieceCounter;
              valueArray[i + 1][j + 1][1] = "lightyellow";
              valueArray[i + 1][j - 1][0] = pieceCounter;
              valueArray[i + 1][j - 1][1] = "lightyellow"
              valueArray[i + 2][j + 1][0] = pieceCounter;
              valueArray[i + 2][j + 1][1] = "lightyellow"
              valueArray[i][j][0] = "・";
              valueArray[i][j][1] = "colour";
              valueArray[i][j + 1][0] = "・";
              valueArray[i][j + 1][1] = "colour";
              valueArray[i + 2][j][0] = "・";
              valueArray[i + 2][j][1] = "colour";
              aspect = "A";
            }
            else {
              failedRotateTrigger();
            }
          }
          else {
            alert("error: unknown aspect exception");
          }
        }
        else if (currentPiece === "I" && attempt === 1) {
          attempt = attempt - 1;
          if (aspect === "A") {
            if (i < 1) {
              failedRotateTrigger();
            }
            else if (i > 15) {
              failedRotateTrigger();
            }
            else if (checkEmpty(valueArray[i - 1][j + 1][0]) && checkEmpty(valueArray[i + 1][j + 1][0]) && checkEmpty(valueArray[i + 2][j + 1][0])) {
              valueArray[i - 1][j + 1][0] = pieceCounter;
              valueArray[i - 1][j + 1][1] = "lightpink";
              valueArray[i + 1][j + 1][0] = pieceCounter;
              valueArray[i + 1][j + 1][1] = "lightpink"
              valueArray[i + 2][j + 1][0] = pieceCounter;
              valueArray[i + 2][j + 1][1] = "lightpink"
              valueArray[i][j][0] = "・";
              valueArray[i][j][1] = "colour";
              valueArray[i][j + 3][0] = "・";
              valueArray[i][j + 3][1] = "colour";
              valueArray[i][j + 2][0] = "・";
              valueArray[i][j + 2][1] = "colour";
              aspect = "B";
            }
            else {
              failedRotateTrigger();
            }
          }
          else if (aspect === "B") {
            if (j < 1) {
              failedRotateTrigger();
            }
            else if (j > 9) {
              failedRotateTrigger();
            }
            else if (checkEmpty(valueArray[i + 1][j - 1][0]) && checkEmpty(valueArray[i + 1][j + 1][0]) && checkEmpty(valueArray[i + 1][j + 2][0])) {
              valueArray[i + 1][j - 1][0] = pieceCounter;
              valueArray[i + 1][j - 1][1] = "lightpink";
              valueArray[i + 1][j + 1][0] = pieceCounter;
              valueArray[i + 1][j + 1][1] = "lightpink"
              valueArray[i + 1][j + 2][0] = pieceCounter;
              valueArray[i + 1][j + 2][1] = "lightpink"
              valueArray[i][j][0] = "・";
              valueArray[i][j][1] = "colour";
              valueArray[i + 2][j][0] = "・";
              valueArray[i + 2][j][1] = "colour";
              valueArray[i + 3][j][0] = "・";
              valueArray[i + 3][j][1] = "colour";
              aspect = "A";
            }
            else {
              failedRotateTrigger();
            }
          }
          else {
            alert("error: unknown aspect exception");
          }
        }
        else if (currentPiece === "O" && attempt === 1) {
          attempt = attempt - 1;
          if (aspect === "A") {
            // do nothing
          }
          else if (aspect === "B") {
            // do nothing
          }
          else if (aspect === "C") {
            // do nothing
          }
          else if (aspect === "D") {
            // do nothing
          }
          else {
            alert("error: unknown aspect exception");
          }
        }
        else if (attempt < 1) {
          // do nothing
        }
        else {
          alert("error: unknown piece exception");
        }
      }
    }
  }
}

// triggered if a rotation can't be completed.
function failedRotateTrigger() {
  console.log("failed rotation")
}

// checks to see if a piece can be moved right.
function checkMoveRightAble() {
  let liesCounter = 0;
  for (let i = (valueArray.length - 1); i > -1; i--) {
    for (let j = (valueArray[i].length - 1); j > -1; j--) {
      if (valueArray[i][j][0] === pieceCounter) {
        if (j === (valueArray[i].length - 1)) {
          liesCounter = liesCounter + 1;
        }
        else {
          if (valueArray[i][j + 1][0] === "・" || valueArray[i][j + 1][0] === pieceCounter) {
            liesCounter = liesCounter;
          }
          else {
            liesCounter = liesCounter + 1;
          }
        }
      }
    }
  }
  if (liesCounter > 0) {
    moveRightAble = false;
  }
  else {
    moveRightAble = true;
  }
}

//checks if a piece can be moved left
function checkMoveLeftAble() {
  let liesCounter = 0;
  for (let i = (valueArray.length - 1); i > -1; i--) {
    for (let j = (valueArray[i].length - 1); j > -1; j--) {
      if (valueArray[i][j][0] === pieceCounter) {
        if (j === 0) {
          liesCounter = liesCounter + 1;
        }
        else {
          if (valueArray[i][j - 1][0] === "・" || valueArray[i][j - 1][0] === pieceCounter) {
            liesCounter = liesCounter;
          }
          else {
            liesCounter = liesCounter + 1;
          }
        }
      }
    }
  }
  if (liesCounter > 0) {
    moveLeftAble = false;
  }
  else {
    moveLeftAble = true;
  }
}

// moves piece right 1 unit.
function moveRight() {
  for (let i = (valueArray.length - 1); i > -1; i--) {
    for (let j = (valueArray[i].length - 1); j > -1; j--) {
      if (valueArray[i][j][0] === pieceCounter) {
        valueArray[i][j + 1][0] = valueArray[i][j][0];
        valueArray[i][j + 1][1] = valueArray[i][j][1];
        valueArray[i][j][0] = "・";
        valueArray[i][j][1] = "colour";
      }
    }
  }
  drawTable(width, height);
}

//moves a piece left 1 unit
function moveLeft() {
  for (let i = 0; i < valueArray.length; i++) {
    for (let j = 0; j < valueArray[i].length; j++) {
      if (valueArray[i][j][0] === pieceCounter) {
        valueArray[i][j - 1][0] = valueArray[i][j][0];
        valueArray[i][j - 1][1] = valueArray[i][j][1];
        valueArray[i][j][0] = "・";
        valueArray[i][j][1] = "colour";
      }
    }
  }
  drawTable(width, height);
}

// "S" button function, presses piece downwards.
function pushDown() {
  checkFallAble();
  let crashCounter = 0;
  while (fallAble === true && crashCounter < 20) {
    crashCounter = crashCounter + 1;
    fall();
    score = score + 25;
    checkFallAble();
  }
}

//spawns a random new piece
function spawnNewPiece() {
  let lotteryTicket = getRandomInt(0, 7);
  if (lotteryTicket === 0) {
    createO();
  }
  else if (lotteryTicket === 1) {
    createS();
  }
  else if (lotteryTicket === 2) {
    createY();
  }
  else if (lotteryTicket === 3) {
    createZ();
  }
  else if (lotteryTicket === 4) {
    createI();
  }
  else if (lotteryTicket === 5) {
    createL();
  }
  else {
    createT();
  }
}

// increases difficulty
function levelUp() {
  level = level + 1;
  if (gameSpeed > 11) {
    gameSpeed = gameSpeed - 10;
  }
}

// called on loss (if there's no space to spawn a piece)
function youLose() {
  alert("you lose");
  reset();
}

// all seven pieces spawn function
function createL() {
  currentPiece = "L"
  pieceCounter = pieceCounter + 1;
  let pieceNumber = pieceCounter;
  if (valueArray[0][4][0] === "・" &&
    valueArray[0][5][0] === "・" &&
    valueArray[0][6][0] === "・" &&
    valueArray[1][4][0] === "・") {
    valueArray[0][4][0] = pieceNumber;
    valueArray[0][5][0] = pieceNumber;
    valueArray[0][6][0] = pieceNumber;
    valueArray[1][4][0] = pieceNumber;
    valueArray[0][4][1] = "violet";
    valueArray[0][5][1] = "violet";
    valueArray[0][6][1] = "violet";
    valueArray[1][4][1] = "violet";
    aspect = "A";
  }
  else {
    youLose();
  }
  drawTable(width, height);
}

function createT() {
  currentPiece = "T";
  pieceCounter = pieceCounter + 1;
  let pieceNumber = pieceCounter;
  if (valueArray[0][4][0] === "・" &&
    valueArray[0][5][0] === "・" &&
    valueArray[0][6][0] === "・" &&
    valueArray[1][5][0] === "・") {
    valueArray[0][4][0] = pieceNumber;
    valueArray[0][5][0] = pieceNumber;
    valueArray[0][6][0] = pieceNumber;
    valueArray[1][5][0] = pieceNumber;
    valueArray[0][4][1] = "lightgreen";
    valueArray[0][5][1] = "lightgreen";
    valueArray[0][6][1] = "lightgreen";
    valueArray[1][5][1] = "lightgreen";
    aspect = "A";
  }
  else {
    youLose();
  }
  drawTable(width, height);
}

function createS() {
  currentPiece = "S";
  pieceCounter = pieceCounter + 1;
  let pieceNumber = pieceCounter;
  if (valueArray[0][4][0] === "・" &&
    valueArray[0][5][0] === "・" &&
    valueArray[1][6][0] === "・" &&
    valueArray[1][5][0] === "・") {
    valueArray[0][4][0] = pieceNumber;
    valueArray[0][5][0] = pieceNumber;
    valueArray[1][6][0] = pieceNumber;
    valueArray[1][5][0] = pieceNumber;
    valueArray[0][4][1] = "salmon";
    valueArray[0][5][1] = "salmon";
    valueArray[1][6][1] = "salmon";
    valueArray[1][5][1] = "salmon";
    aspect = "A";
  }
  else {
    youLose();
  }
  drawTable(width, height);
}

function createZ() {
  currentPiece = "Z";
  pieceCounter = pieceCounter + 1;
  let pieceNumber = pieceCounter;
  if (valueArray[0][5][0] === "・" &&
    valueArray[0][6][0] === "・" &&
    valueArray[1][4][0] === "・" &&
    valueArray[1][5][0] === "・") {
    valueArray[0][5][0] = pieceNumber;
    valueArray[0][6][0] = pieceNumber;
    valueArray[1][4][0] = pieceNumber;
    valueArray[1][5][0] = pieceNumber;
    valueArray[0][5][1] = "darkorange";
    valueArray[0][6][1] = "darkorange";
    valueArray[1][4][1] = "darkorange";
    valueArray[1][5][1] = "darkorange";
    aspect = "A";
  }
  else {
    youLose();
  }
  drawTable(width, height);
}

function createI() {
  currentPiece = "I";
  pieceCounter = pieceCounter + 1;
  let pieceNumber = pieceCounter;
  if (valueArray[0][4][0] === "・" &&
    valueArray[0][5][0] === "・" &&
    valueArray[0][6][0] === "・" &&
    valueArray[0][7][0] === "・") {
    valueArray[0][4][0] = pieceNumber;
    valueArray[0][5][0] = pieceNumber;
    valueArray[0][6][0] = pieceNumber;
    valueArray[0][7][0] = pieceNumber;
    valueArray[0][4][1] = "lightpink";
    valueArray[0][5][1] = "lightpink";
    valueArray[0][6][1] = "lightpink";
    valueArray[0][7][1] = "lightpink";
    aspect = "A";
  }
  else {
    youLose();
  }
  drawTable(width, height);
}

function createO() {
  currentPiece = "O";
  pieceCounter = pieceCounter + 1;
  let pieceNumber = pieceCounter;
  if (valueArray[0][6][0] === "・" &&
    valueArray[0][5][0] === "・" &&
    valueArray[1][6][0] === "・" &&
    valueArray[1][5][0] === "・") {
    valueArray[0][6][0] = pieceNumber;
    valueArray[0][5][0] = pieceNumber;
    valueArray[1][6][0] = pieceNumber;
    valueArray[1][5][0] = pieceNumber;
    valueArray[0][6][1] = "lightblue";
    valueArray[0][5][1] = "lightblue";
    valueArray[1][6][1] = "lightblue";
    valueArray[1][5][1] = "lightblue";
    aspect = "A";
  }
  else {
    youLose();
  }
  drawTable(width, height);
}

function createY() {
  currentPiece = "Y";
  pieceCounter = pieceCounter + 1;
  let pieceNumber = pieceCounter;
  if (valueArray[0][4][0] === "・" &&
    valueArray[0][5][0] === "・" &&
    valueArray[0][6][0] === "・" &&
    valueArray[1][6][0] === "・") {
    valueArray[0][4][0] = pieceNumber;
    valueArray[0][5][0] = pieceNumber;
    valueArray[0][6][0] = pieceNumber;
    valueArray[1][6][0] = pieceNumber;
    valueArray[0][4][1] = "lightyellow";
    valueArray[0][5][1] = "lightyellow";
    valueArray[0][6][1] = "lightyellow";
    valueArray[1][6][1] = "lightyellow";
    aspect = "A";
  }
  else {
    youLose();
  }
  drawTable(width, height);
}

// sets colour of board
function setColour() {
  let tdElems = document.querySelectorAll('td');
  for (let i = 0; i < tdElems.length; i++) {
    if (tdElems[i].innerHTML === "・") {
      tdElems[i].style.color = "white";
      tdElems[i].style.backgroundColor = "black";
    }
    else {
      let colourIndex = parseInt(tdElems[i].innerHTML, 10);
      let colourSet = "red"
      for (let q = 0; q < valueArray.length; q++) {
        for (let p = 0; p < valueArray[q].length; p++) {
          if (colourIndex === valueArray[q][p][0]) {
            colourSet = valueArray[q][p][1];
          }
        }
      }
      tdElems[i].style.color = colourSet;
      tdElems[i].style.backgroundColor = colourSet;
    }
  }
}

// startup
document.addEventListener('DOMContentLoaded', () => {

  buildArray(width, height);
  drawTable(width, height);
  spawnNewPiece();

  document.addEventListener('keyup', handlerFunc);
})