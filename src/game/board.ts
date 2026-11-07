import type { Board, Move, Symbol } from './types';

export const WIN_LINES: readonly (readonly [number, number, number])[] = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6], // diagonals
];

export function createBoard(): Board {
  return Array<null>(9).fill(null);
}

export function legalMoves(board: Board): Move[] {
  if (getWinner(board)) return [];
  const moves: Move[] = [];
  board.forEach((cell, index) => {
    if (cell === null) moves.push(index);
  });
  return moves;
}

/** Returns the winner and the three winning cells, or null if nobody has won. */
export function getWinningLine(board: Board): { winner: Symbol; line: readonly number[] } | null {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    const cell = board[a];
    if (cell && cell === board[b] && cell === board[c]) {
      return { winner: cell, line };
    }
  }
  return null;
}

export function getWinner(board: Board): Symbol | null {
  return getWinningLine(board)?.winner ?? null;
}

export function isDraw(board: Board): boolean {
  return !getWinner(board) && board.every((cell) => cell !== null);
}

export function isGameOver(board: Board): boolean {
  return getWinner(board) !== null || isDraw(board);
}

/** Returns a new board with the move applied. Throws on an invalid move. */
export function applyMove(board: Board, move: Move, symbol: Symbol): Board {
  if (!Number.isInteger(move) || move < 0 || move > 8) {
    throw new Error(`Invalid move: ${move} is not a cell index from 0 to 8`);
  }
  if (isGameOver(board)) {
    throw new Error('Invalid move: the game is already over');
  }
  if (board[move] !== null) {
    throw new Error(`Invalid move: cell ${move} is already taken`);
  }
  const next = [...board];
  next[move] = symbol;
  return next;
}
