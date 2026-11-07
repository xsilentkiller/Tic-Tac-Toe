import { describe, expect, it } from 'vitest';
import {
  WIN_LINES,
  applyMove,
  createBoard,
  getWinner,
  getWinningLine,
  isDraw,
  isGameOver,
  legalMoves,
  nextSymbol,
} from '../../src/game/board';
import type { Board, Cell } from '../../src/game/types';

/** Builds a board from a 9-char string: X, O, or . for empty. */
function boardFrom(s: string): Board {
  return [...s].map((ch): Cell => (ch === 'X' || ch === 'O' ? ch : null));
}

describe('createBoard', () => {
  it('creates 9 empty cells', () => {
    const board = createBoard();
    expect(board).toHaveLength(9);
    expect(board.every((cell) => cell === null)).toBe(true);
  });
});

describe('win detection', () => {
  it('knows exactly 8 winning lines', () => {
    expect(WIN_LINES).toHaveLength(8);
  });

  describe.each(WIN_LINES.map((line) => [line.join(','), line] as const))('line %s', (_name, line) => {
    it.each(['X', 'O'] as const)('is detected for %s', (symbol) => {
      const cells: Cell[] = Array(9).fill(null);
      line.forEach((i) => (cells[i] = symbol));
      expect(getWinner(cells)).toBe(symbol);
      expect(getWinningLine(cells)).toEqual({ winner: symbol, line });
      expect(isGameOver(cells)).toBe(true);
    });
  });

  it('returns null on an empty board', () => {
    expect(getWinner(createBoard())).toBeNull();
    expect(getWinningLine(createBoard())).toBeNull();
  });

  it('returns null when a line is mixed', () => {
    expect(getWinner(boardFrom('XXO......'))).toBeNull();
  });

  it('detects a win on a full board (last move wins)', () => {
    const board = boardFrom('XOXOXOOXX'); // X wins on the 0-4-8 diagonal
    expect(getWinner(board)).toBe('X');
    expect(isDraw(board)).toBe(false);
  });
});

describe('draw detection', () => {
  it('detects a full board with no winner', () => {
    const board = boardFrom('XOXXOOOXX');
    expect(getWinner(board)).toBeNull();
    expect(isDraw(board)).toBe(true);
    expect(isGameOver(board)).toBe(true);
  });

  it('is not a draw while cells remain', () => {
    expect(isDraw(boardFrom('XOXXOOOX.'))).toBe(false);
    expect(isGameOver(boardFrom('XOXXOOOX.'))).toBe(false);
  });
});

describe('legalMoves', () => {
  it('lists every cell on an empty board', () => {
    expect(legalMoves(createBoard())).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('lists only empty cells', () => {
    expect(legalMoves(boardFrom('XO.......'))).toEqual([2, 3, 4, 5, 6, 7, 8]);
  });

  it('is empty once the game is won', () => {
    expect(legalMoves(boardFrom('XXXOO....'))).toEqual([]);
  });

  it('is empty on a drawn board', () => {
    expect(legalMoves(boardFrom('XOXXOOOXX'))).toEqual([]);
  });
});

describe('nextSymbol', () => {
  it('starts with X and alternates', () => {
    expect(nextSymbol(createBoard())).toBe('X');
    expect(nextSymbol(boardFrom('X........'))).toBe('O');
    expect(nextSymbol(boardFrom('XO.......'))).toBe('X');
  });
});

describe('applyMove', () => {
  it('places the symbol and returns a new board', () => {
    const board = createBoard();
    const next = applyMove(board, 4, 'X');
    expect(next[4]).toBe('X');
    expect(board[4]).toBeNull(); // original untouched
    expect(next).not.toBe(board);
  });

  it('rejects an occupied cell', () => {
    const board = applyMove(createBoard(), 0, 'X');
    expect(() => applyMove(board, 0, 'O')).toThrow(/already taken/);
  });

  it.each([-1, 9, 100])('rejects out-of-range index %i', (move) => {
    expect(() => applyMove(createBoard(), move, 'X')).toThrow(/Invalid move/);
  });

  it.each([1.5, NaN, Infinity])('rejects non-integer index %s', (move) => {
    expect(() => applyMove(createBoard(), move, 'X')).toThrow(/Invalid move/);
  });

  it('rejects moves after a win', () => {
    expect(() => applyMove(boardFrom('XXXOO....'), 8, 'O')).toThrow(/already over/);
  });

  it('rejects moves after a draw', () => {
    expect(() => applyMove(boardFrom('XOXXOOOXX'), 0, 'X')).toThrow();
  });
});
