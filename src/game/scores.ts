import type { Difficulty } from './types';

export type ScoreKey = Difficulty | 'pvp';

/**
 * Results for one bucket. Against the computer p1 is the human and p2 the
 * computer; in Player vs Player p1 is X and p2 is O.
 */
export interface Tally {
  p1: number;
  p2: number;
  draws: number;
}

export type Scores = Record<ScoreKey, Tally>;
export type RoundResult = 'p1' | 'p2' | 'draw';

export const SCORE_KEYS: readonly ScoreKey[] = ['pvp', 'easy', 'medium', 'hard'];

export function emptyScores(): Scores {
  return {
    pvp: { p1: 0, p2: 0, draws: 0 },
    easy: { p1: 0, p2: 0, draws: 0 },
    medium: { p1: 0, p2: 0, draws: 0 },
    hard: { p1: 0, p2: 0, draws: 0 },
  };
}

/** Returns new scores with one result added to the given bucket. */
export function recordResult(scores: Scores, key: ScoreKey, result: RoundResult): Scores {
  const tally = scores[key];
  const field = result === 'draw' ? 'draws' : result;
  return { ...scores, [key]: { ...tally, [field]: tally[field] + 1 } };
}
