import { describe, expect, it } from 'vitest';
import { emptyScores, recordResult } from '../../src/game/scores';

describe('scores', () => {
  it('starts at zero for every bucket', () => {
    const scores = emptyScores();
    for (const tally of Object.values(scores)) {
      expect(tally).toEqual({ p1: 0, p2: 0, draws: 0 });
    }
  });

  it('records a result only in its own difficulty', () => {
    const scores = recordResult(emptyScores(), 'hard', 'p2');
    expect(scores.hard).toEqual({ p1: 0, p2: 1, draws: 0 });
    expect(scores.easy).toEqual({ p1: 0, p2: 0, draws: 0 });
    expect(scores.medium).toEqual({ p1: 0, p2: 0, draws: 0 });
    expect(scores.pvp).toEqual({ p1: 0, p2: 0, draws: 0 });
  });

  it('counts wins, losses and draws separately', () => {
    let scores = emptyScores();
    scores = recordResult(scores, 'easy', 'p1');
    scores = recordResult(scores, 'easy', 'p1');
    scores = recordResult(scores, 'easy', 'draw');
    expect(scores.easy).toEqual({ p1: 2, p2: 0, draws: 1 });
  });

  it('does not mutate the previous scores', () => {
    const before = emptyScores();
    recordResult(before, 'easy', 'p1');
    expect(before.easy.p1).toBe(0);
  });
});
