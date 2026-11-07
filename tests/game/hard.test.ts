import { describe, expect, it } from 'vitest';
import { hardStrategy } from '../../src/game/ai/hard';
import { applyMove, createBoard, getWinner, legalMoves, otherSymbol } from '../../src/game/board';
import type { Board, Cell, Symbol } from '../../src/game/types';

function boardFrom(s: string): Board {
  return [...s].map((ch): Cell => (ch === 'X' || ch === 'O' ? ch : null));
}

/**
 * Plays every possible game: the opponent tries every legal move, Hard answers
 * with its strategy. Returns how many games were played and how many Hard lost.
 */
function playAllGames(hard: Symbol, firstToMove: Symbol) {
  let games = 0;
  let hardLosses = 0;

  function explore(board: Board, toMove: Symbol): void {
    const winner = getWinner(board);
    const moves = legalMoves(board);
    if (winner || moves.length === 0) {
      games++;
      if (winner === otherSymbol(hard)) hardLosses++;
      return;
    }
    if (toMove === hard) {
      explore(applyMove(board, hardStrategy(board, hard), toMove), otherSymbol(toMove));
    } else {
      for (const move of moves) explore(applyMove(board, move, toMove), otherSymbol(toMove));
    }
  }

  explore(createBoard(), firstToMove);
  return { games, hardLosses };
}

describe('hardStrategy', () => {
  it.each([
    ['X', 'X'],
    ['X', 'O'],
    ['O', 'X'],
    ['O', 'O'],
  ] as const)('never loses as %s when %s moves first (all opponent sequences)', (hard, first) => {
    const { games, hardLosses } = playAllGames(hard, first);
    expect(games).toBeGreaterThan(0);
    expect(hardLosses).toBe(0);
  });

  it('takes an immediate win', () => {
    expect(hardStrategy(boardFrom('XX.OO....'), 'X')).toBe(2);
  });

  it('prefers winning over blocking', () => {
    // O threatens 5; X can win at 2 instead of blocking.
    expect(hardStrategy(boardFrom('XX.OO....'), 'X')).toBe(2);
    expect(hardStrategy(boardFrom('XX.OO.X..'), 'O')).toBe(5);
  });

  it('blocks a winning threat', () => {
    expect(hardStrategy(boardFrom('XX.O.....'), 'O')).toBe(2);
  });

  it('returns a legal move on every position it faces', () => {
    const board = boardFrom('XO.......');
    expect(legalMoves(board)).toContain(hardStrategy(board, 'X'));
  });
});
