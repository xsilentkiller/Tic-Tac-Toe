import { legalMoves } from '../board';
import type { Strategy } from '../types';

/** Easy: any legal move at random. */
export const easyStrategy: Strategy = (board) => {
  const moves = legalMoves(board);
  return moves[Math.floor(Math.random() * moves.length)]!;
};
