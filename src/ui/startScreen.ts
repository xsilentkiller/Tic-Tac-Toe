import type { Difficulty, FirstMover, GameMode, Settings, Symbol } from '../game/types';
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

  // Computer options only matter in Player vs Computer mode.
  const cpuOptions = el('div', 'options');
  cpuOptions.append(
    segmented<Difficulty>(
      'Difficulty',
      'difficulty',
      [
        { value: 'easy', label: 'Easy' },
        { value: 'medium', label: 'Medium' },
        { value: 'hard', label: 'Hard' },
      ],
      settings.difficulty,
      (value) => (settings.difficulty = value),
    ),
    segmented<Symbol>(
      'Your symbol',
      'symbol',
      [
        { value: 'X', label: 'X' },
        { value: 'O', label: 'O' },
      ],
      settings.symbol,
      (value) => (settings.symbol = value),
    ),
    segmented<FirstMover>(
      'Who moves first',
      'firstMover',
      [
        { value: 'player', label: 'Player' },
        { value: 'computer', label: 'Computer' },
        { value: 'random', label: 'Random' },
      ],
      settings.firstMover,
      (value) => (settings.firstMover = value),
    ),
  );
  cpuOptions.hidden = settings.mode !== 'cpu';

  screen.append(
    segmented<GameMode>(
      'Mode',
      'mode',
      [
        { value: 'pvp', label: 'Player vs Player' },
        { value: 'cpu', label: 'Player vs Computer' },
      ],
      settings.mode,
      (mode) => {
        settings.mode = mode;
        cpuOptions.hidden = mode !== 'cpu';
      },
    ),
    cpuOptions,
  );

  const start = el('button', 'primary', 'Start Game');
  start.type = 'button';
  start.addEventListener('click', () => onStart(settings));
  screen.appendChild(start);

  root.appendChild(screen);
}
