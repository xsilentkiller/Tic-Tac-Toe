import { applyMove, getWinner, legalMoves, otherSymbol } from '../board';
import type { Board, Move, Strategy, Symbol } from '../types';
import { easyStrategy } from './easy';

/** A move that wins the game immediately for `symbol`, or null. */
export function findWinningMove(board: Board, symbol: Symbol): Move | null {
  for (const move of legalMoves(board)) {
    if (getWinner(applyMove(board, move, symbol)) === symbol) return move;
  }
  return null;
}

/** Medium: win if possible, otherwise block the opponent's win, otherwise random. */
export const mediumStrategy: Strategy = (board, symbol) => {
  return (
    findWinningMove(board, symbol) ??
    findWinningMove(board, otherSymbol(symbol)) ??
    easyStrategy(board, symbol)
  );
};
