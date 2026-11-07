import { HumanPlayer } from './players';
import type { Player, Settings, Symbol } from './types';

/** Builds the two players for the chosen mode. */
export function createPlayers(_settings: Settings): Record<Symbol, Player> {
  return { X: new HumanPlayer('X'), O: new HumanPlayer('O') };
}

/** Which symbol plays first this round. Player vs Player: X always starts. */
export function resolveFirstSymbol(_settings: Settings): Symbol {
  return 'X';
}
