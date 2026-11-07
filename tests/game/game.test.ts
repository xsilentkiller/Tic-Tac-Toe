import { describe, expect, it } from 'vitest';
import { Game, type GameState } from '../../src/game/game';
import { HumanPlayer } from '../../src/game/players';

/** Lets pending promises settle. */
const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

function setup(first: 'X' | 'O' = 'X') {
  const states: GameState[] = [];
  const game = new Game({ X: new HumanPlayer('X'), O: new HumanPlayer('O') }, first, (s) =>
    states.push(s),
  );
  game.run();
  const last = () => states[states.length - 1]!;
  return { game, states, last };
}

async function play(game: Game, moves: number[]) {
  for (const move of moves) {
    game.input(move);
    await flush();
  }
}

describe('Game (two human players)', () => {
  it('alternates turns starting with the first symbol', async () => {
    const { game, last } = setup('X');
    expect(last().current).toBe('X');
    await play(game, [4]);
    expect(last().board[4]).toBe('X');
    expect(last().current).toBe('O');
    await play(game, [0]);
    expect(last().board[0]).toBe('O');
  });

  it('can start with O', async () => {
    const { game, last } = setup('O');
    await play(game, [4]);
    expect(last().board[4]).toBe('O');
  });

  it('ignores a click on a taken cell', async () => {
    const { game, last } = setup();
    await play(game, [4, 4]);
    expect(last().board[4]).toBe('X');
    expect(last().current).toBe('O');
  });

  it('detects a win and stops accepting moves', async () => {
    const { game, last } = setup();
    await play(game, [0, 3, 1, 4, 2]);
    expect(last().winner).toBe('X');
    expect(last().winningLine).toEqual([0, 1, 2]);
    expect(last().over).toBe(true);
    await play(game, [8]);
    expect(last().board[8]).toBeNull();
  });

  it('detects a draw', async () => {
    const { game, last } = setup();
    // X O X / X O O / O X X
    await play(game, [0, 1, 2, 4, 3, 5, 7, 6, 8]);
    expect(last().draw).toBe(true);
    expect(last().winner).toBeNull();
  });

  it('stops reacting after stop()', async () => {
    const { game, states } = setup();
    game.stop();
    const before = states.length;
    await play(game, [4]);
    expect(states.length).toBe(before);
  });
});
