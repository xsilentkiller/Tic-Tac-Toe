export type Symbol = 'X' | 'O';
export type Cell = Symbol | null;

/** 9 cells, row-major: index = row * 3 + col. */
export type Board = readonly Cell[];

/** A move is the index (0-8) of the cell to fill. */
export type Move = number;

export type Difficulty = 'easy' | 'medium' | 'hard';

/** An AI level. Every difficulty has this same shape, so adding one is just a new function. */
export type Strategy = (board: Board, symbol: Symbol) => Move;

/** Anyone who can play a move: a human clicking cells, or an AI. */
export interface Player {
  readonly symbol: Symbol;
  /** Resolves with the move this player wants to make on the given board. */
  getMove(board: Board): Promise<Move>;
  /** The UI forwards cell clicks here. Players that are not human ignore them. */
  handleInput(move: Move): void;
}

export type GameMode = 'pvp' | 'cpu';
export type FirstMover = 'player' | 'computer' | 'random';

export interface Settings {
  mode: GameMode;
  difficulty: Difficulty;
  /** The human's symbol in Player vs Computer. */
  symbol: Symbol;
  firstMover: FirstMover;
}
