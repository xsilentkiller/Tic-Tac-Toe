import type { Difficulty, Strategy } from '../types';
import { easyStrategy } from './easy';

/** To add a level: write a Strategy, add its name to Difficulty, and register it here. */
export const strategies: Record<Difficulty, Strategy> = {
  easy: easyStrategy,
  // Placeholders until milestone 5.
  medium: easyStrategy,
  hard: easyStrategy,
};
