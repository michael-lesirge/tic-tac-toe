// I have very little javascript experience currently.

const MIN_SIZE = 1;
const DEFAULT_SIZE = 3;

const currentPlayerSpan = document.querySelector(".current-player");
const gameOverSpan = document.querySelector(".game-over");

// TODO allow users to specify num of players and there letters in home page (index.html)
const players = ["x", "o"].map(element => { return element.toUpperCase(); });

const params = new URLSearchParams(location.search);
function getValidSizeParam(name) {
    if (params.has(name)) {
        const size = parseInt(params.get(name));
        if (!isNaN(size)) {
            return Math.max(size, MIN_SIZE)
        }
    }
    return DEFAULT_SIZE
}

const BLANK_CHAR = ''
class Board {
    constructor(width = DEFAULT_SIZE, height = DEFAULT_SIZE) {
        this.width = width;
        this.height = height;
        this.size = this.width * this.height;

        this.turnCount = 0;
        this.gameCount = 0;
        this.currentPlayerIndex = 0;

        this.boardArray = Array(this.height);
        this.boardBody = document.querySelector('.board-body');

        // create board on page and in array
        for (let i = 0; i < this.height; i++) {
            this.boardArray[i] = Array(this.width);
            let tableRow = this.boardBody.insertRow();
            for (let j = 0; j < this.width; j++) {
                let cell = document.createElement('td');
                tableRow.insertCell(cell);
            }
        }
    }
    

    getCell(i, j) { return this.boardBody.children[i].children[j]; }

    set(i, j, char) {
        let cell = this.getCell(i, j);
        cell.innerText = this.boardArray[i][j] = char;
        if (char !== BLANK_CHAR) {
            cell.classList.add('occupied');
        }
    }


    playerTurn(i, j) {
        if (!this.getCell(i, j).classList.contains('occupied')) {
            const currentPlayer = players[this.currentPlayerIndex];
            this.set(i, j, currentPlayer);
            
            this.currentPlayerIndex = (this.turnCount + this.gameCount) % players.length;
            this.turnCount++;

            if (this.isPlayerWinner(currentPlayer)) {
                setWinner(currentPlayer);
            }
            else {
                currentPlayerSpan.innerText = players[this.currentPlayerIndex] + "s turn.";
            }
        }
    }

    reset(showCords=false) {
        this.currentPlayerIndex = this.gameCount % players.length
        currentPlayerSpan.innerText = "Starting game with " + players[this.currentPlayerIndex] + "s.";
        this.turnCount = 0;

        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                this.set(i, j, BLANK_CHAR);
                if (showCords) {
                    const cords = document.createElement("span")
                    cords.classList.add("cords")
                    cords.innerText = "(" + i + "," + j + ")"
                    this.getCell(i, j).appendChild(cords)
                }
                
                let cell = this.getCell(i, j);
                cell.classList.remove('occupied');
                cell.onclick = () => this.playerTurn(i, j)
            }
        }
        this.gameCount++;
    }

    getStringSize() { return '(' + this.width + 'x' + this.height + ')'; }

    isPlayerWinner(player) {
        for (let i = 0; i < this.height; i++) {
            let row = this.boardArray[i];
            if (this.#isWinningArray(row, player)) {
                return true;
            }
        }
    }

    #isWinningArray = (array, player) => array.every( el => el === player );

    isOverflowing() {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                if (this.getCell(i, j).getBoundingClientRect().left < 0) { return true; }
            }
        }
    }
}

const board = new Board(getValidSizeParam('width'), getValidSizeParam('height'));

function setWinner(player) {
    currentPlayerSpan.innerText = player + " Wins!";
    board.boardBody.style.visibility = "hidden"


}

function fixOverflow() {
    const boardClassList = document.querySelector(".board-container").classList
    const bodyStyle = document.body.style
    if (board.isOverflowing()) {
        boardClassList.remove("centered-container");
        bodyStyle.overflowX = "scroll";
    }
    else {
        boardClassList.add("centered-container");
        bodyStyle.overflowX = "default";
    }
}

fixOverflow();
window.onresize = fixOverflow;

var showCords = true
reset = () => board.reset(showCords);

document.querySelector('.reset-board').onclick = reset;
reset();

document.querySelector('title').innerText += ' ' + board.getStringSize();