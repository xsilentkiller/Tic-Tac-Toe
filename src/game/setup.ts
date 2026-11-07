import { strategies } from './ai';
import { otherSymbol } from './board';
import { AIPlayer, AI_DELAY_MS, HumanPlayer } from './players';
import type { Player, Settings, Symbol } from './types';

/** Builds the two players for the chosen mode. */
export function createPlayers(settings: Settings, aiDelayMs = AI_DELAY_MS): Record<Symbol, Player> {
  if (settings.mode === 'pvp') {
    return { X: new HumanPlayer('X'), O: new HumanPlayer('O') };
  }
  const human = settings.symbol;
  const computer = otherSymbol(human);
  const players = {} as Record<Symbol, Player>;
  players[human] = new HumanPlayer(human);
  players[computer] = new AIPlayer(computer, strategies[settings.difficulty], aiDelayMs);
  return players;
}

/** Which symbol plays first this round. Player vs Player: X always starts. */
export function resolveFirstSymbol(settings: Settings, random: () => number = Math.random): Symbol {
  if (settings.mode === 'pvp') return 'X';
  const human = settings.symbol;
  switch (settings.firstMover) {
    case 'player':
      return human;
    case 'computer':
      return otherSymbol(human);
    case 'random':
      return random() < 0.5 ? human : otherSymbol(human);
  }
}
