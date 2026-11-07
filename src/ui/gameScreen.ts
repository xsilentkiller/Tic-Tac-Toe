import { Game, type GameState } from '../game/game';
import { recordResult, type RoundResult, type ScoreKey } from '../game/scores';
import { createPlayers, resolveFirstSymbol } from '../game/setup';
import type { Difficulty, Settings } from '../game/types';
import { renderBoard } from './boardView';
import { confirmDialog } from './dialogs';
import { el } from './dom';
import { loadScores, saveScores, saveSettings } from './storage';

const DIFFICULTY_LABELS: Record<Difficulty, string> = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };

export function showGameScreen(root: HTMLElement, settings: Settings, onMenu: () => void): void {
  root.replaceChildren();

  const vsComputer = settings.mode === 'cpu';
  let scores = loadScores();

  const screen = el('main', 'screen');
  const title = el('h1');
  const scoreboard = el('p', 'scoreboard');
  const status = el('p', 'status');
  status.setAttribute('aria-live', 'polite');
  const boardEl = el('div');
  const controls = el('div', 'controls');

  const rematch = el('button', 'primary', 'Rematch');
  rematch.type = 'button';
  const menu = el('button', undefined, 'Menu');
  menu.type = 'button';

  // Difficulty dropdown, next to the rematch button (Player vs Computer only).
  const difficultySelect = el('select');
  difficultySelect.setAttribute('aria-label', 'Difficulty');
  for (const level of Object.keys(DIFFICULTY_LABELS) as Difficulty[]) {
    difficultySelect.add(new Option(DIFFICULTY_LABELS[level], level));
  }
  difficultySelect.value = settings.difficulty;

  controls.append(rematch);
  if (vsComputer) controls.append(difficultySelect);
  controls.append(menu);

  screen.append(title, scoreboard, status, boardEl, controls);
  root.appendChild(screen);

  let game: Game | null = null;
  let lastState: GameState | null = null;
  let recorded = false;

  const scoreKey = (): ScoreKey => (vsComputer ? settings.difficulty : 'pvp');

  function renderHeader(): void {
    title.textContent = vsComputer ? `Vs Computer: ${DIFFICULTY_LABELS[settings.difficulty]}` : 'Player vs Player';
    const t = scores[scoreKey()];
    const [name1, name2] = vsComputer ? ['You', 'Computer'] : ['X', 'O'];
    scoreboard.textContent = `${name1} ${t.p1} · ${name2} ${t.p2} · Draws ${t.draws}`;
  }

  function statusText(state: GameState): string {
    if (state.draw) return "It's a draw";
    if (vsComputer) {
      if (state.winner) return state.winner === settings.symbol ? 'You win!' : 'Computer wins!';
      return state.current === settings.symbol ? `Your turn (${settings.symbol})` : 'Computer is thinking…';
    }
    if (state.winner) return `${state.winner} wins!`;
    return `${state.current}'s turn`;
  }

  function resultOf(state: GameState): RoundResult {
    if (!state.winner) return 'draw';
    const p1Symbol = vsComputer ? settings.symbol : 'X';
    return state.winner === p1Symbol ? 'p1' : 'p2';
  }

  function render(state: GameState): void {
    lastState = state;
    // Count each finished round exactly once.
    if (state.over && !recorded) {
      recorded = true;
      scores = recordResult(scores, scoreKey(), resultOf(state));
      saveScores(scores);
    }
    renderHeader();
    status.textContent = statusText(state);
    renderBoard(boardEl, state.board, (move) => game?.input(move), state.winningLine);
    // Purely visual: the computer's player object already ignores clicks.
    boardEl.classList.toggle('locked', vsComputer && !state.over && state.current !== settings.symbol);
  }

  function startRound(): void {
    game?.stop();
    recorded = false;
    const current = new Game(createPlayers(settings), resolveFirstSymbol(settings), render);
    game = current;
    current.run().catch(console.error);
  }

  function roundInProgress(): boolean {
    return !!lastState && !lastState.over && lastState.board.some((cell) => cell !== null);
  }

  difficultySelect.addEventListener('change', async () => {
    const next = difficultySelect.value as Difficulty;
    if (roundInProgress()) {
      const ok = await confirmDialog(
        `Switch to ${DIFFICULTY_LABELS[next]}? This restarts the current round.`,
        'Restart round',
      );
      if (!ok) {
        difficultySelect.value = settings.difficulty;
        return;
      }
    }
    settings.difficulty = next;
    saveSettings(settings);
    startRound(); // a new round uses the new level (and its own scoreboard)
  });

  rematch.addEventListener('click', startRound);
  menu.addEventListener('click', () => {
    game?.stop();
    onMenu();
  });

  startRound();
}
