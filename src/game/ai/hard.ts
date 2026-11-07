import { applyMove, getWinner, legalMoves, otherSymbol } from '../board';
import type { Board, Strategy, Symbol } from '../types';

/**
 * Score of `board` from `me`'s point of view, with `toMove` about to play.
 * Wins are worth more the sooner they happen (and losses hurt less the later
 * they happen), so the AI takes the fastest win and delays a loss.
 */
function minimax(
  board: Board,
  toMove: Symbol,
  me: Symbol,
  depth: number,
  alpha: number,
  beta: number,
): number {
  const winner = getWinner(board);
  if (winner) return winner === me ? 10 - depth : depth - 10;

  const moves = legalMoves(board);
  if (moves.length === 0) return 0; // draw

  const maximizing = toMove === me;
  let best = maximizing ? -Infinity : Infinity;

  for (const move of moves) {
    const score = minimax(applyMove(board, move, toMove), otherSymbol(toMove), me, depth + 1, alpha, beta);
    if (maximizing) {
      best = Math.max(best, score);
      alpha = Math.max(alpha, best);
    } else {
      best = Math.min(best, score);
      beta = Math.min(beta, best);
    }
    // The opponent would never let the game reach this branch, so stop searching it.
    if (beta <= alpha) break;
  }
  return best;
}

/** Hard: perfect play. Never loses. Picks the first best move, so it is deterministic. */
export const hardStrategy: Strategy = (board, symbol) => {
  const moves = legalMoves(board);
  let bestMove = moves[0]!;
  let bestScore = -Infinity;

  for (const move of moves) {
    const score = minimax(
      applyMove(board, move, symbol),
      otherSymbol(symbol),
      symbol,
      1,
      -Infinity,
      Infinity,
    );
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }
  return bestMove;
};
