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

// Player Factory
const Player = (function () {

      function createPlayer(name, mark) {
        let _name = name
        let _mark = mark

        function changeName(newName) {
            if (typeof newName === 'string' && newName.trim() !== '') {
                _name = newName.trim()
            } else {
                console.error("Tên mới không hợp lệ.")
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

// Gameboard Factory
const Gameboard = (function () {
    const gameboard = []
    const player1 = Player.createPlayer(PLAYER_ONE_NAME_DEFAULT, X_MARK)
    const player2 = Player.createPlayer(PLAYER_TWO_NAME_DEFAULT, O_MARK)
    let currentPlayer = player1
    let winner = ''
    let hasDraw = false
    let gameTurns = 0

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
                winner = firstCellSymbol
            } 
        } 
        
        hasDraw = gameTurns === 10 && !winner
    }

    function addMark(rowIndex, colIndex, mark) {
        gameboard[rowIndex][colIndex] = mark
    }

    function gameTurn() { 
        currentPlayer = currentPlayer === player1 ? player2 : player1;
        gameTurns++
        return currentPlayer
    }

    function getCurrentPlayer() {
        return currentPlayer
    }

    function isGameOver() {
        return winner !== '' || hasDraw
    }

    return {
        createBoard,
        checkWinner,
        gameTurn,
        addMark,
        getCurrentPlayer,
        isGameOver
    }
})()

// DisplayController Factory
const DisplayController = (function () {
    const boardElement = document.querySelector('#gameboard');
    const playerTurnElemnt = document.querySelector('.player-turn')


    const renderBoard = (board) => {

        board.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const cellDiv = document.createElement('div');
                cellDiv.classList.add('cell');
                cellDiv.textContent = cell;
                boardElement.appendChild(cellDiv);

                cellDiv.addEventListener('click', () => {
                    if (board[rowIndex][colIndex] === null && !Gameboard.isGameOver()) {
                        const currentPlayer = Gameboard.getCurrentPlayer() 
                        Gameboard.addMark(rowIndex, colIndex, currentPlayer.mark)
                        Gameboard.gameTurn()

                        const nextPlayer = Gameboard.getCurrentPlayer()
                        updateTurnText(nextPlayer.name)
                        
                        Gameboard.checkWinner(board)
                        if (Gameboard.isGameOver()) {
                            DisplayController.renderGameOver()
                        }
                        updateBoardDisplay(board)
                    }
                })
            })
        })
    }

    function updateBoardDisplay(board) {
        boardElement.innerHTML = '';
        renderBoard(board)
    }

    function renderGameOver(result) {
        console.log(123);
        
        const gameoverDiv = document.createElement('gameover');
        
    }

    function updateTurnText(playerName) {
        playerTurnElemnt.innerHTML = `${playerName}'s Turn`
    }

    return { renderBoard, updateBoardDisplay, renderGameOver, updateTurnText }

})()


function App() {
    DisplayController.renderBoard(Gameboard.createBoard(GRID_SIZE))
    
    const currentPlayer = Gameboard.getCurrentPlayer() 
    DisplayController.updateTurnText(currentPlayer.name)
}

// // When the entire DOM has finished loading, run the App function
document.addEventListener('DOMContentLoaded', function () {
    App()
})