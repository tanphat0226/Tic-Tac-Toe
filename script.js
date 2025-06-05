// Constant
const GRID_SIZE = 3
const X_MARK = 'X'
const O_MARK = 'O'
const PLAYER_ONE_NAME_DEFAULT = 'Player 1'
const PLAYER_TWO_NAME_DEFAULT = 'Player 2'
const WIN_COMBINATON = [
   [
    { row: 0, col: 0 },
    { row: 0, col: 1 },
    { row: 0, col: 2 }
   ],
   [
    { row: 1, col: 0 },
    { row: 1, col: 1 },
    { row: 1, col: 2 }
   ],
   [
    { row: 2, col: 0 },
    { row: 2, col: 1 },
    { row: 2, col: 2 }
   ],
   [
    { row: 0, col: 0 },
    { row: 1, col: 0 },
    { row: 2, col: 0 }
   ],
   [
    { row: 0, col: 1 },
    { row: 1, col: 1 },
    { row: 2, col: 1 }
   ],
   [
    { row: 0, col: 2 },
    { row: 1, col: 2 },
    { row: 2, col: 2 }
   ],
   [
    { row: 0, col: 0 },
    { row: 1, col: 1 },
    { row: 2, col: 2 }
   ],
   [
    { row: 0, col: 2 },
    { row: 1, col: 1 },
    { row: 2, col: 0 }
   ]
]

// Gameboard Factory
const Gameboard = (function () {
    const gameboard = []

    function createBoard(gridSize) {
        for (let i = 0; i < gridSize; i++) {
            gameboard.push(Array(gridSize).fill(null))
        }
        return gameboard
    }

    function checkWinner(gameboard) {
        for (const combination of WIN_COMBINATON) {
            const firstCellSymbol = gameboard[combination[0].row][combination[0].col]
            const secondCellSymbol = gameboard[combination[1].row][combination[1].col]
            const thirdCellSymbol = gameboard[combination[2].row][combination[2].col]

            if (firstCellSymbol &&
                firstCellSymbol === secondCellSymbol &&
                firstCellSymbol === thirdCellSymbol
            ) {
                console.log(firstCellSymbol)
            }
        }
    }

    return {
        createBoard,
        checkWinner
    }
})()


// Player Factory
const Player = (function () {

      function createPlayer(name, mark) {
        let _name = name;  // biến private
        let _mark = mark;

        function changeName(newName) {
            if (typeof newName === 'string' && newName.trim() !== '') {
                _name = newName.trim();
            } else {
                console.error("Tên mới không hợp lệ.");
            }
        }

        return {
            name: _name,
            mark: _mark,
            changeName
        }
    }

    return {
        createPlayer
    }
})()

// DisplayController Factory
const DisplayController = (function () {
    const boardElement = document.querySelector('#gameboard');

    const render = (board) => {
        boardElement.innerHTML = '';

        board.forEach((row, index) => {
           row.forEach(cell => {
                const cellDiv = document.createElement('div');
                cellDiv.classList.add('cell');
                boardElement.appendChild(cellDiv);
           })
        });
    }

    return { render }

})()


function App() {
    const gameboard = Gameboard.createBoard(GRID_SIZE)
    const player1 = Player.createPlayer(PLAYER_ONE_NAME_DEFAULT, X_MARK)
    const player2 = Player.createPlayer(PLAYER_TWO_NAME_DEFAULT, O_MARK)

    DisplayController.render(gameboard)
}

// // When the entire DOM has finished loading, run the App function
document.addEventListener('DOMContentLoaded', function () {
    App();
})