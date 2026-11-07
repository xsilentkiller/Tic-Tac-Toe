import { describe, expect, it } from 'vitest';
import { findWinningMove, mediumStrategy } from '../../src/game/ai/medium';
import { applyMove, getWinner, isGameOver, legalMoves, otherSymbol } from '../../src/game/board';
import type { Board, Cell, Symbol } from '../../src/game/types';

/** Every unfinished board with a plausible piece count (X and O counts differ by at most 1). */
function allPositions(): Board[] {
  const boards: Board[] = [];
  for (let n = 0; n < 3 ** 9; n++) {
    const cells: Cell[] = [];
    let rest = n;
    for (let i = 0; i < 9; i++) {
      cells.push([null, 'X', 'O'][rest % 3] as Cell);
      rest = Math.floor(rest / 3);
    }
    const x = cells.filter((c) => c === 'X').length;
    const o = cells.filter((c) => c === 'O').length;
    if (Math.abs(x - o) <= 1 && !isGameOver(cells)) boards.push(cells);
  }
  return boards;
}

const positions = allPositions();
const SYMBOLS: Symbol[] = ['X', 'O'];

function allWinningMoves(board: Board, symbol: Symbol): number[] {
  return legalMoves(board).filter((m) => getWinner(applyMove(board, m, symbol)) === symbol);
}

describe('mediumStrategy', () => {
  it('always takes a winning move when one exists', () => {
    let checked = 0;
    for (const board of positions) {
      for (const symbol of SYMBOLS) {
        if (allWinningMoves(board, symbol).length === 0) continue;
        const move = mediumStrategy(board, symbol);
        expect(getWinner(applyMove(board, move, symbol))).toBe(symbol);
        checked++;
      }
    }
    expect(checked).toBeGreaterThan(100);
  });

  it('blocks the opponent when it cannot win itself', () => {
    let checked = 0;
    for (const board of positions) {
      for (const symbol of SYMBOLS) {
        if (allWinningMoves(board, symbol).length > 0) continue;
        const threats = allWinningMoves(board, otherSymbol(symbol));
        if (threats.length === 0) continue;
        // Repeat because the fallback is random; a block must never be random.
        for (let i = 0; i < 3; i++) {
          expect(threats).toContain(mediumStrategy(board, symbol));
        }
        checked++;
      }
    }
    expect(checked).toBeGreaterThan(100);
  });

  it('prefers winning over blocking', () => {
    const board: Board = ['X', 'X', null, 'O', 'O', null, null, null, null];
    expect(mediumStrategy(board, 'X')).toBe(2);
    expect(mediumStrategy(board, 'O')).toBe(5);
  });

  it('otherwise plays a legal move', () => {
    for (const board of positions) {
      for (const symbol of SYMBOLS) {
        expect(legalMoves(board)).toContain(mediumStrategy(board, symbol));
      }
    }
  });
});

describe('findWinningMove', () => {
  it('returns null when there is no immediate win', () => {
    expect(findWinningMove(Array(9).fill(null), 'X')).toBeNull();
  });
});
