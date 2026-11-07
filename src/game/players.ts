import type { Board, Move, Player, Symbol } from './types';

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
