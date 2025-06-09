// Constant
const GRID_SIZE = 3
const MAX_TURNS = GRID_SIZE * GRID_SIZE
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
    const _players = []

    function createPlayer(name, mark) {
        let _name = name
        let _mark = mark

        function changeName(newName) {
            if (typeof newName === 'string' && newName.trim() !== '') {
                _name = newName.trim()
            } else {
                console.error("Unvalid name.")
            }
        }

         const player = {
            name: _name,
            mark: _mark,
            changeName
        }

        _players.push(player)
        return player
    }

    function findByMark(mark) {
        return _players.find(p => p.mark === mark)
    }


    return {
        createPlayer,
        findByMark,
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


    function createBoard() {
        for (let i = 0; i < GRID_SIZE; i++) {
            gameboard.push(Array(GRID_SIZE).fill(null))
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
                return winner
            } 
        } 
        
        hasDraw = gameTurns === MAX_TURNS && !winner
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

    function restart() {
        for (let i = 0; i < GRID_SIZE; i++) {
           for (let j = 0; j < GRID_SIZE; j++) {
                gameboard[i][j] = null
           }
        }

        currentPlayer = player1
        winner = ''
        hasDraw = false
        gameTurns = 0
    }

    function getGameBoard() {
        return gameboard
    }

    return {
        getGameBoard,
        createBoard,
        checkWinner,
        gameTurn,
        addMark,
        getCurrentPlayer,
        isGameOver,
        restart
    }
})()

// DisplayController Factory
const DisplayController = (function () {
    let boardElement, playerTurnElement = null

    function init({ boardContainer, playerTurnText }) {
        boardElement = boardContainer
        playerTurnElement = playerTurnText
    }

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
                        
                        const winner = Gameboard.checkWinner(board)

                        if (Gameboard.isGameOver()) {
                            DisplayController.renderGameOver(winner)
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
        const playerWin = Player.findByMark(result)

        let gameOverHtml
        
        if (result) {
            gameOverHtml = `
                <div class="gameover">
                    <h3 class="gameover-title">${playerWin.name}</h3>
                    <button class="restart-btn">Play Again</button>
                </div>
            `
        } else {
            gameOverHtml = `
                <div class="gameover">
                    <h3 class="gameover-title">Draw! </h3>
                    <button class="restart-btn">Play Again</button>
                </div>
            `
        }

        const wrapper = document.querySelector('#gameboard-wrapper') 
     

        wrapper.insertAdjacentHTML("beforeend", gameOverHtml)

        // Assign event to Play Again button
        const restartBtn = document.querySelector('.restart-btn')
        restartBtn.addEventListener('click', () => {
            const gameover = document.querySelector('.gameover')
            if (gameover) {
                gameover.remove()
            }
            Gameboard.restart()
            const currentPlayer = Gameboard.getCurrentPlayer()
             
            updateTurnText(currentPlayer.name)
            updateBoardDisplay(Gameboard.getGameBoard())
        })
    }

    function updateTurnText(playerName) {
        playerTurnElement.innerHTML = `${playerName}'s Turn`
    }

    return { init, renderBoard, updateBoardDisplay, renderGameOver, updateTurnText }

})()


function App() {
    const boardContainer = document.querySelector('#gameboard')
    const playerTurnText = document.querySelector('.player-turn')

    DisplayController.init({
        boardContainer,
        playerTurnText
    })

    const board = Gameboard.createBoard()
    DisplayController.renderBoard(board)
    
    const currentPlayer = Gameboard.getCurrentPlayer() 
    DisplayController.updateTurnText(currentPlayer.name)
}

// // When the entire DOM has finished loading, run the App function
document.addEventListener('DOMContentLoaded', function () {
    App()
})