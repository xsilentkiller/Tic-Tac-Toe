import type { Board, Move, Player, Strategy, Symbol } from './types';

export const AI_DELAY_MS = 400;

/** An AI player: asks its strategy for a move after a short delay so it feels natural. */
export class AIPlayer implements Player {
  constructor(
    readonly symbol: Symbol,
    private strategy: Strategy,
    private delayMs = AI_DELAY_MS,
  ) {}

  getMove(board: Board): Promise<Move> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(this.strategy(board, this.symbol)), this.delayMs);
    });
  }

  handleInput(): void {
    // The computer ignores clicks, which also blocks input during its turn.
  }
}

/** A human player: getMove waits until the UI forwards a click on an empty cell. */
export class HumanPlayer implements Player {
  private pending: { board: Board; resolve: (move: Move) => void } | null = null;

  constructor(readonly symbol: Symbol) {}

  getMove(board: Board): Promise<Move> {
    return new Promise((resolve) => {
      this.pending = { board, resolve };
    });
  }

  handleInput(move: Move): void {
    const pending = this.pending;
    // Ignore clicks when it is not our turn or the cell is taken.
    if (!pending || pending.board[move] !== null) return;
    this.pending = null;
    pending.resolve(move);
  }
}
