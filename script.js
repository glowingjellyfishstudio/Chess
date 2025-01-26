const chessboard = document.getElementById('chessboard');

const pieces = {
    'r': { name: 'rook', color: 'black' },
    'n': { name: 'knight', color: 'black' },
    'b': { name: 'bishop', color: 'black' },
    'q': { name: 'queen', color: 'black' },
    'k': { name: 'king', color: 'black' },
    'p': { name: 'pawn', color: 'black' },
    'R': { name: 'rook', color: 'white' },
    'N': { name: 'knight', color: 'white' },
    'B': { name: 'bishop', color: 'white' },
    'Q': { name: 'queen', color: 'white' },
    'K': { name: 'king', color: 'white' },
    'P': { name: 'pawn', color: 'white' },
};

const initialBoard = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
];

let selectedPiece = null;
let currentPlayer = 'white';

function renderBoard(board) {
    chessboard.innerHTML = '';
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement('div');
            square.className = 'square ' + ((row + col) % 2 === 0 ? 'white' : 'black');
            square.dataset.row = row;
            square.dataset.col = col;
            if (board[row][col]) {
                square.textContent = board[row][col];
                square.classList.add(pieces[board[row][col]].color);
                square.classList.add('piece');
            }
            square.addEventListener('click', () => handleSquareClick(row, col));
            chessboard.appendChild(square);
        }
    }
}

function handleSquareClick(row, col) {
    if (selectedPiece) {
        if (isValidMove(selectedPiece, row, col)) {
            movePiece(selectedPiece, row, col);
            if (isCheck(currentPlayer === 'white' ? 'black' : 'white')) {
                alert(`${currentPlayer === 'white' ? 'Black' : 'White'} is in check!`);
                if (isCheckmate(currentPlayer === 'white' ? 'black' : 'white')) {
                    alert(`${currentPlayer} wins by checkmate!`);
                    return;
                }
            }
            selectedPiece = null;
            currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
        } else {
            selectedPiece = null;
        }
    } else if (initialBoard[row][col] && pieces[initialBoard[row][col]].color === currentPlayer) {
        selectedPiece = { row, col, piece: initialBoard[row][col] };
    }
    renderBoard(initialBoard);
}

function isValidMove(selectedPiece, targetRow, targetCol) {
    const { row, col, piece } = selectedPiece;
    const pieceType = pieces[piece].name;
    const color = pieces[piece].color;

    // Add logic to check valid moves for each piece type
    switch (pieceType) {
        case 'pawn':
            return isValidPawnMove(row, col, targetRow, targetCol, color);
        case 'rook':
            return isValidRookMove(row, col, targetRow, targetCol, color);
        case 'knight':
            return isValidKnightMove(row, col, targetRow, targetCol, color);
        case 'bishop':
            return isValidBishopMove(row, col, targetRow, targetCol, color);
        case 'queen':
            return isValidQueenMove(row, col, targetRow, targetCol, color);
        case 'king':
            return isValidKingMove(row, col, targetRow, targetCol, color);
        default:
            return false;
    }
}

function movePiece(selectedPiece, targetRow, targetCol) {
    const { row, col, piece } = selectedPiece;
    initialBoard[targetRow][targetCol] = piece;
    initialBoard[row][col] = '';
}

function isValidPawnMove(row, col, targetRow, targetCol, color) {
    const direction = color === 'white' ? -1 : 1;
    if (col === targetCol && initialBoard[targetRow][targetCol] === '') {
        if (row + direction === targetRow) {
            return true;
        }
        if ((row === 1 && color === 'black') || (row === 6 && color === 'white')) {
            if (row + 2 * direction === targetRow && initialBoard[row + direction][col] === '') {
                return true;
            }
        }
    }
    if (Math.abs(col - targetCol) === 1 && row + direction === targetRow && initialBoard[targetRow][targetCol] !== '' && pieces[initialBoard[targetRow][targetCol]].color !== color) {
        return true;
    }
    return false;
}

function isValidRookMove(row, col, targetRow, targetCol, color) {
    if (row === targetRow) {
        for (let i = Math.min(col, targetCol) + 1; i < Math.max(col, targetCol); i++) {
            if (initialBoard[row][i] !== '') return false;
        }
        return true;
    }
    if (col === targetCol) {
        for (let i = Math.min(row, targetRow) + 1; i < Math.max(row, targetRow); i++) {
            if (initialBoard[i][col] !== '') return false;
        }
        return true;
    }
    return false;
}

function isValidKnightMove(row, col, targetRow, targetCol, color) {
    const rowDiff = Math.abs(row - targetRow);
    const colDiff = Math.abs(col - targetCol);
    return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
}

function isValidBishopMove(row, col, targetRow, targetCol, color) {
    if (Math.abs(row - targetRow) !== Math.abs(col - targetCol)) return false;
    const rowStep = row < targetRow ? 1 : -1;
    const colStep = col < targetCol ? 1 : -1;
    for (let i = 1; i < Math.abs(row - targetRow); i++) {
        if (initialBoard[row + i * rowStep][col + i * colStep] !== '') return false;
    }
    return true;
}

function isValidQueenMove(row, col, targetRow, targetCol, color) {
    return isValidRookMove(row, col, targetRow, targetCol, color) || isValidBishopMove(row, col, targetRow, targetCol, color);
}

function isValidKingMove(row, col, targetRow, targetCol, color) {
    const rowDiff = Math.abs(row - targetRow);
    const colDiff = Math.abs(col - targetCol);
    return rowDiff <= 1 && colDiff <= 1;
}

function isCheck(color) {
    const kingPosition = findKing(color);
    return isSquareAttacked(kingPosition.row, kingPosition.col, color);
}

function isCheckmate(color) {
    const kingPosition = findKing(color);
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (initialBoard[row][col] && pieces[initialBoard[row][col]].color === color) {
                const piece = { row, col, piece: initialBoard[row][col] };
                for (let targetRow = 0; targetRow < 8; targetRow++) {
                    for (let targetCol = 0; targetCol < 8; targetCol++) {
                        if (isValidMove(piece, targetRow, targetCol)) {
                            const temp = initialBoard[targetRow][targetCol];
                            movePiece(piece, targetRow, targetCol);
                            if (!isCheck(color)) {
                                movePiece({ row: targetRow, col: targetCol, piece: initialBoard[targetRow][targetCol] }, row, col);
                                initialBoard[targetRow][targetCol] = temp;
                                return false;
                            }
                            movePiece({ row: targetRow, col: targetCol, piece: initialBoard[targetRow][targetCol] }, row, col);
                            initialBoard[targetRow][targetCol] = temp;
                        }
                    }
                }
            }
        }
    }
    return true;
}

function findKing(color) {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (initialBoard[row][col] === (color === 'white' ? 'K' : 'k')) {
                return { row, col };
            }
        }
    }
}

function isSquareAttacked(row, col, attackingColor) {
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (initialBoard[r][c] && pieces[initialBoard[r][c]].color === attackingColor) {
                const piece = { row: r, col: c, piece: initialBoard[r][c] };
                if (isValidMove(piece, row, col)) {
                    return true;
                }
            }
        }
    }
    return false;
}

renderBoard(initialBoard);
