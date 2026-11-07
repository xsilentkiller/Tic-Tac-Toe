import { applyMove, createBoard, getWinningLine, isDraw, isGameOver } from './board';
import type { Board, Move, Player, Symbol } from './types';

export interface GameState {
  board: Board;
  /** Whose turn it is (meaningless once the game is over). */
  current: Symbol;
  winner: Symbol | null;
  winningLine: readonly number[] | null;
  draw: boolean;
  over: boolean;
}

/**
 * The single game loop, used for every mode. It only talks to the Player
 * interface, so it never knows whether a human or an AI is moving.
 */
export class Game {
  private board: Board = createBoard();
  private current: Symbol;
  private stopped = false;

  constructor(
    private players: Record<Symbol, Player>,
    first: Symbol,
    private onChange: (state: GameState) => void,
  ) {
    this.current = first;
  }

  get state(): GameState {
    const win = getWinningLine(this.board);
    return {
      board: this.board,
      current: this.current,
      winner: win?.winner ?? null,
      winningLine: win?.line ?? null,
      draw: isDraw(this.board),
      over: isGameOver(this.board),
    };
  }

  /** Plays until the game ends or stop() is called. Calls onChange after every move. */
  async run(): Promise<void> {
    this.onChange(this.state);
    while (!this.stopped && !isGameOver(this.board)) {
      const move = await this.players[this.current].getMove(this.board);
      if (this.stopped) return;
      this.board = applyMove(this.board, move, this.current);
      this.current = this.current === 'X' ? 'O' : 'X';
      this.onChange(this.state);
    }
  }

  /** Forward a UI click to whoever's turn it is. */
  input(move: Move): void {
    if (!this.stopped) this.players[this.current].handleInput(move);
  }

  /** Abandon this game (used by rematch, menu and difficulty change). */
  stop(): void {
    this.stopped = true;
  }
}
