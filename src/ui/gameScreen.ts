import { Game, type GameState } from '../game/game';
import { createPlayers, resolveFirstSymbol } from '../game/setup';
import type { Settings } from '../game/types';
import { renderBoard } from './boardView';
import { el } from './dom';

export function showGameScreen(root: HTMLElement, settings: Settings, onMenu: () => void): void {
  root.replaceChildren();

  const screen = el('main', 'screen');
  const title = el('h1', undefined, 'Player vs Player');
  const status = el('p', 'status');
  status.setAttribute('aria-live', 'polite');
  const boardEl = el('div');
  const controls = el('div', 'controls');

  const rematch = el('button', 'primary', 'Rematch');
  rematch.type = 'button';
  const menu = el('button', undefined, 'Menu');
  menu.type = 'button';
  controls.append(rematch, menu);

  screen.append(title, status, boardEl, controls);
  root.appendChild(screen);

  let game: Game | null = null;

  function statusText(state: GameState): string {
    if (state.winner) return `${state.winner} wins!`;
    if (state.draw) return "It's a draw";
    return `${state.current}'s turn`;
  }

  function render(state: GameState): void {
    status.textContent = statusText(state);
    renderBoard(boardEl, state.board, (move) => game?.input(move), state.winningLine);
  }

  function startRound(): void {
    game?.stop();
    const current = new Game(createPlayers(settings), resolveFirstSymbol(settings), render);
    game = current;
    current.run().catch(console.error);
  }

  rematch.addEventListener('click', startRound);
  menu.addEventListener('click', () => {
    game?.stop();
    onMenu();
  });

  startRound();
}
