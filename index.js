const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const container = document.getElementById('fieldWrapper');

let gameField = [[], [], []]
let clickCounter = 0
let possibleClicksCount = 0
let ableToTurn = true
let opponentsTurn = false

startGame();
addResetListener();

function initGameField(dimension, gameField) {
    for (let i = 0; i < dimension; i++) {
        gameField[i] = new Array(dimension)
        for (let j = 0; j < dimension; j++) {
            gameField[i][j] = EMPTY;
        }
    }
    console.log(gameField, 'Field initialized')
}

function checkDimensionString(dimension){
    return parseInt(dimension) && dimension > 2
}

function startGame() {
    let dimension = prompt("Введи размер")
    if(checkDimensionString(dimension)){
        possibleClicksCount = dimension * dimension;
        initGameField(parseInt(dimension), gameField);
        renderGrid(parseInt(dimension));
    }
}

function renderGrid(dimension) {
    container.innerHTML = '';

    for (let i = 0; i < dimension; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < dimension; j++) {
            const cell = document.createElement('td');
            cell.textContent = gameField[i][j];
            cell.addEventListener('click', () => cellClickHandler(i, j));
            row.appendChild(cell);
        }
        container.appendChild(row);
    }
}

function checkWinner(gameField) {
    const checkResultString = (result, index) => {
        if (result === CROSS.repeat(gameField.length)) {
            alert(`${CROSS} победил`)
            paintWinningFields(gameField, index, true)
            ableToTurn = false
            return true
        } else if (result === ZERO.repeat(gameField.length)) {
            alert(`${ZERO} победил`)
            paintWinningFields(gameField, index, true)
            ableToTurn = false
            return true
        }
    }
    const checkHorizontalWinner = () => {
        for (let i = 0; i < gameField.length; i++) {
            let rowString = gameField[i].join("")
            if (rowString === CROSS.repeat(gameField.length)) {
                alert(`${CROSS} победил`)
                ableToTurn = false
                paintWinningFields(rowString, i)
                break
            } else if (rowString === ZERO.repeat(gameField.length)) {
                alert(`${ZERO} победил`)
                ableToTurn = false
                paintWinningFields(rowString, i)
                break
            }
        }
    }
    const checkVerticalWinner = (index) => {
        let flatArray = gameField.flat(2)
        let word = ''
        for (let i = index; i < flatArray.length; i += gameField.length) {
            if (flatArray[i] === EMPTY)
                continue
            word += flatArray[i]
        }
        checkResultString(word, index)
    }
    const checkLeftDiagonalWinner = () => {
        let col = 0;
        let result = '';
        for (let row = 0; row < gameField.length; row++) {
            result += gameField[row][col++];
        }
        checkResultString(result);
    }
    const checkRightDiagonalWinner = () => {
        let col = gameField.length - 1;
        let result = ''
        for (let row = 0; row < gameField.length; row++) {
            result += gameField[row][col--]
        }
        checkResultString(result)
    }
    const paintWinningFields = (line, startIndex, col = false) => {
        if (col) {
            for (let i = 0; i < line.length; i++) {
                findCell(i, startIndex).style.color = 'red'
            }
            return
        }
        for (let i = 0; i < line.length; i++) {
            findCell(startIndex, i).style.color = 'red'
        }
    }
    checkHorizontalWinner()
    for (let i = 0; i < gameField.length; i++) {
        if (checkVerticalWinner(i)) {
            break
        }
    }
    checkLeftDiagonalWinner()
    checkRightDiagonalWinner()
}

function addOneDimension() {
    let newDimension = gameField.length + 1
    possibleClicksCount = newDimension * newDimension - possibleClicksCount
    let newGameField = [[]]
    initGameField(newDimension, newGameField)
    for(let i=0;i<gameField.length;i++){
        newGameField[i] = gameField[i]
    }
    gameField = newGameField
    renderGrid(newDimension)
}

function cellClickHandler(row, col) {
    const makeOpponentTurn = () => {
        function getRandomInt(max) {
            return Math.floor(Math.random() * Math.floor(max));
        }
        console.log("opponents turn")
        if(opponentsTurn)
            while (1){
                let col = getRandomInt(gameField.length)
                let row = getRandomInt(gameField.length)
                if(gameField[row][col] === EMPTY){
                    clickOnCell(row, col)
                    break
                }
            }
    }
    opponentsTurn = !opponentsTurn
    if(!ableToTurn) return
    if (gameField[row][col] === EMPTY) {
        let fieldState = clickCounter % 2 === 0 ? CROSS : ZERO;
        gameField[row][col] = fieldState;
        console.log(`Clicked on cell: ${row}, ${col}`);
        clickCounter++;
        renderSymbolInCell(fieldState, row, col);
    }
    checkWinner(gameField)
    if (clickCounter === possibleClicksCount){
        addOneDimension()
    }
    else if (opponentsTurn)
        makeOpponentTurn()
}

function renderSymbolInCell(symbol, row, col, color = '#333') {
    const targetCell = findCell(row, col);

    targetCell.textContent = symbol;
    targetCell.style.color = color;
}

function findCell(row, col) {
    const targetRow = container.querySelectorAll('tr')[row];
    return targetRow.querySelectorAll('td')[col];
}

function addResetListener() {
    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', resetClickHandler);
}

function resetClickHandler() {
    console.log('reset!');
    clickCounter = 0
    ableToTurn = true
    for (let i = 0; i < gameField.length; i++)
        for (let j = 0; j < gameField.length; j++) {
            gameField[i][j] = EMPTY
            renderSymbolInCell(EMPTY, i, j)
        }

}


/* Test Function */

/* Победа первого игрока */
function testWin() {
    clickOnCell(0, 2);
    clickOnCell(0, 0);
    clickOnCell(2, 0);
    clickOnCell(1, 1);
    clickOnCell(2, 2);
    clickOnCell(1, 2);
    clickOnCell(2, 1);
}

/* Ничья */
function testDraw() {
    clickOnCell(2, 0);
    clickOnCell(1, 0);
    clickOnCell(1, 1);
    clickOnCell(0, 0);
    clickOnCell(1, 2);
    clickOnCell(1, 2);
    clickOnCell(0, 2);
    clickOnCell(0, 1);
    clickOnCell(2, 1);
    clickOnCell(2, 2);
}

function clickOnCell(row, col) {
    findCell(row, col).click();
}
