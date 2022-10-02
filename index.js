let cells = document.querySelector(".gameBoard");
let flags = document.getElementById("minesLeft");
let message = document.getElementById("finalMessage");
let flagsLeft = 10;
let boardSize = 9;
let shuffledBoard = [];
let squaresVisited = [];
let numberToBeDisplayed = 0;
let flagsPosition = []
let cellsVisited = 0;
let gameRunning = 0;

createGameBoard();

function createGameBoard() {
    let bombs = Array(flagsLeft).fill('bomb');
    let safeSpaces = Array(boardSize * boardSize - flagsLeft).fill('empty');
    let fullGrid = safeSpaces.concat(bombs);
    shuffledBoard = fullGrid.sort(() => Math.random() - 0.5);
    for(let i = 0; i < boardSize * boardSize; ++i) {
        let square = document.createElement('div');
        square.setAttribute('id', i);
        cells.appendChild(square);
        square.addEventListener('click', () => {
            if (gameRunning == 0) {
                checkForBomb(square, i);
            }
        })
        square.addEventListener('contextmenu', s => {
            flagsPosition.push(i);
            s.preventDefault();
            placeFlag(square);
        })
    }
 }

function checkForBomb(square, index) {
    if (shuffledBoard[index] == 'bomb') {
        gameRunning = 1;
        gameOver(square);
    } else if (flagsPosition.includes(index)) {
        deleteFlag(square);
    } else {
        checkAdjacentTiles(square, index);
    }
}   

function checkAdjacentTiles(square, index) {
    ++cellsVisited;
    checkForWin(cellsVisited);
    squaresVisited.push(index);
    let rowIndex = index / boardSize;
    rowIndex = Math.floor(rowIndex);
    let columnIndex = index - (rowIndex * boardSize);
    numberToBeDisplayed = 0;
    let currentIndex = 0;
    for (let i = rowIndex - 1; i <= rowIndex + 1; ++i) {  
        if (i >= 0 && i < boardSize) {
        for (let j = columnIndex - 1; j <= columnIndex + 1; ++j) {
            if (j >= 0 && j < boardSize) {
                currentIndex = i * boardSize + j;
                if (shuffledBoard[currentIndex] == 'bomb') {
                        ++numberToBeDisplayed;
                } 
            }
        }
        }
    }
    if (numberToBeDisplayed != 0) {
        square.style.background = "rgb(204, 219, 207)";
        displayNumber(numberToBeDisplayed, index);
    } else {
        checkForEmptySpace(square, rowIndex, columnIndex);
    }
}


function checkForEmptySpace(square, rowIndex, columnIndex) {
    for (let i = rowIndex - 1; i <= rowIndex + 1; ++i) {  
        if (i >= 0 && i < boardSize) {
            for (let j = columnIndex - 1; j <= columnIndex + 1; ++j) {
                if (j >= 0 && j < boardSize) {
                    currentIndex = i * boardSize + j;
                    if (!squaresVisited.includes(currentIndex) && shuffledBoard[currentIndex] == 'empty') {
                        let change = document.getElementById(currentIndex);
                        change.style.background = "rgb(204, 219, 207)";
                        checkAdjacentTiles(square, currentIndex);
                    }
                }
            }
        }
    }
}

function displayNumber(numberToBeDisplayed, index) {
    square = document.getElementById(index);
    square.innerText = numberToBeDisplayed;
    square.style.background = "rgb(204, 219, 207)";
    if (numberToBeDisplayed == 1) {
        square.style.color = "rgb(26, 48, 174)";
    } else if (numberToBeDisplayed == 2) {
        square.style.color = "rgb(163, 30, 203)";
    } else if (numberToBeDisplayed == 3) {
        square.style.color = "rgb(203, 30, 30)";
    } else if (numberToBeDisplayed == 4) {
        square.style.color = "rgb(0, 0, 0)";
    }
}

function placeFlag(square) {
    if (square.innerText == "") {
        square.innerHTML = "&#128681";
        --flagsLeft;
        flags.innerText = "Mines: " + flagsLeft;
    }
}

function deleteFlag(square) {
    square.innerHTML = "";
    ++flagsLeft;
    flags.innerText = "Mines: " + flagsLeft;
}

function checkForWin(cellsVisited) {
    if(cellsVisited == 81 - 10 && gameRunning != 1) {
        displayWinningMessage();
    }
}

function gameOver(square) {
    for (let i = 0; i < boardSize * boardSize; ++i) {
        if(shuffledBoard[i] == 'bomb') {
            square = document.getElementById(i);
            square.innerHTML = "&#128163";
        }
    }
    displayGameOver();
}

function displayGameOver() {
    message.innerText = "You Lost!";
}

function displayWinningMessage() {
    message.innerText = "You Won!"
}

function restartGame() {
    window.location.reload();
}
