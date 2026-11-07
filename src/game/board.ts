import type { Board } from './types';

export function createBoard(): Board {
  return Array<null>(9).fill(null);
}
