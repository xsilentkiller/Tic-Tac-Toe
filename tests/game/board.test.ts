import { describe, expect, it } from 'vitest';
import { createBoard } from '../../src/game/board';

describe('createBoard', () => {
  it('creates 9 empty cells', () => {
    const board = createBoard();
    expect(board).toHaveLength(9);
    expect(board.every((cell) => cell === null)).toBe(true);
  });
});
