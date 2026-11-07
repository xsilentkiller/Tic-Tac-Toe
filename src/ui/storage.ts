import { SCORE_KEYS, emptyScores, type Scores } from '../game/scores';
import type { Settings } from '../game/types';

const SETTINGS_KEY = 'ttt.settings';

export const DEFAULT_SETTINGS: Settings = {
  mode: 'pvp',
  difficulty: 'medium',
  symbol: 'X',
  firstMover: 'player',
};

// localStorage can throw (private mode, blocked storage), so the game must work without it.
export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    // fall through to defaults
  }
  return { ...DEFAULT_SETTINGS };
}

export function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // ignore: remembering settings is a convenience only
  }
}

const SCORES_KEY = 'ttt.scores';

export function loadScores(): Scores {
  const scores = emptyScores();
  try {
    const saved = JSON.parse(localStorage.getItem(SCORES_KEY) ?? '{}');
    for (const key of SCORE_KEYS) {
      const t = saved?.[key];
      // Only trust well-formed numbers; anything else stays at zero.
      if ([t?.p1, t?.p2, t?.draws].every((n) => Number.isInteger(n) && n >= 0)) {
        scores[key] = { p1: t.p1, p2: t.p2, draws: t.draws };
      }
    }
  } catch {
    // fall through with whatever we have
  }
  return scores;
}

export function saveScores(scores: Scores): void {
  try {
    localStorage.setItem(SCORES_KEY, JSON.stringify(scores));
  } catch {
    // ignore
  }
}
