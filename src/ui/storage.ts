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
