import { describe, expect, it } from 'vitest';
import { easyStrategy } from '../../src/game/ai/easy';
import { createBoard, isGameOver, legalMoves } from '../../src/game/board';
import { Game, type GameState } from '../../src/game/game';
import { AIPlayer, HumanPlayer } from '../../src/game/players';
import { createPlayers, resolveFirstSymbol } from '../../src/game/setup';
import type { Settings } from '../../src/game/types';

const cpu = (overrides: Partial<Settings> = {}): Settings => ({
  mode: 'cpu',
  difficulty: 'easy',
  symbol: 'X',
  firstMover: 'player',
  ...overrides,
});

describe('resolveFirstSymbol', () => {
  it('pvp: X always starts', () => {
    expect(resolveFirstSymbol({ ...cpu(), mode: 'pvp', symbol: 'O' })).toBe('X');
  });

  it('player first: the human symbol starts', () => {
    expect(resolveFirstSymbol(cpu({ symbol: 'O', firstMover: 'player' }))).toBe('O');
  });

  it('computer first: the other symbol starts', () => {
    expect(resolveFirstSymbol(cpu({ symbol: 'O', firstMover: 'computer' }))).toBe('X');
    expect(resolveFirstSymbol(cpu({ symbol: 'X', firstMover: 'computer' }))).toBe('O');
  });

  it('random: follows the random source', () => {
    const settings = cpu({ symbol: 'X', firstMover: 'random' });
    expect(resolveFirstSymbol(settings, () => 0.1)).toBe('X');
    expect(resolveFirstSymbol(settings, () => 0.9)).toBe('O');
  });
});

describe('createPlayers', () => {
  it('pvp: two humans', () => {
    const players = createPlayers({ ...cpu(), mode: 'pvp' });
    expect(players.X).toBeInstanceOf(HumanPlayer);
    expect(players.O).toBeInstanceOf(HumanPlayer);
  });

  it('cpu: human gets the chosen symbol, computer the other', () => {
    const players = createPlayers(cpu({ symbol: 'O' }));
    expect(players.O).toBeInstanceOf(HumanPlayer);
    expect(players.X).toBeInstanceOf(AIPlayer);
  });
});

describe('easy strategy', () => {
  it('always returns a legal move', () => {
    const board = createBoard();
    for (let i = 0; i < 50; i++) {
      expect(legalMoves(board)).toContain(easyStrategy(board, 'X'));
    }
  });
});

describe('Game with a computer player', () => {
  it('the computer replies on its own and input is ignored during its turn', async () => {
    const states: GameState[] = [];
    const players = createPlayers(cpu(), 20);
    const game = new Game(players, 'X', (s) => states.push(s));
    game.run();

    game.input(4); // human move
    await new Promise((r) => setTimeout(r, 0));
    expect(states.at(-1)!.current).toBe('O'); // computer is thinking

    game.input(0); // must be ignored: not the human's turn
    await new Promise((r) => setTimeout(r, 0));
    expect(states.at(-1)!.board[0]).toBeNull();

    await new Promise((r) => setTimeout(r, 60)); // computer moves
    const board = states.at(-1)!.board;
    expect(board.filter((c) => c === 'O')).toHaveLength(1);
    expect(states.at(-1)!.current).toBe('X');
  });

  it('plays a whole game to completion', async () => {
    let last: GameState | undefined;
    const game = new Game(createPlayers(cpu(), 0), 'X', (s) => (last = s));
    game.run();
    for (let i = 0; i < 20 && !last!.over; i++) {
      const move = legalMoves(last!.board)[0]!;
      if (last!.current === 'X') game.input(move);
      await new Promise((r) => setTimeout(r, 5));
    }
    expect(isGameOver(last!.board)).toBe(true);
  });
});
