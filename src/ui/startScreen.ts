import type { GameMode, Settings } from '../game/types';
import { el, segmented } from './dom';

export function showStartScreen(
  root: HTMLElement,
  saved: Settings,
  onStart: (settings: Settings) => void,
): void {
  const settings: Settings = { ...saved };
  root.replaceChildren();

  const screen = el('main', 'screen');
  screen.appendChild(el('h1', undefined, 'Tic-Tac-Toe'));

  screen.appendChild(
    segmented<GameMode>(
      'Mode',
      'mode',
      [
        { value: 'pvp', label: 'Player vs Player' },
        { value: 'cpu', label: 'Player vs Computer', disabled: true },
      ],
      settings.mode,
      (mode) => {
        settings.mode = mode;
      },
    ),
  );

  const start = el('button', 'primary', 'Start Game');
  start.type = 'button';
  start.addEventListener('click', () => onStart(settings));
  screen.appendChild(start);

  root.appendChild(screen);
}
