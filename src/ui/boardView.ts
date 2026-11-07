import type { Board, Move } from '../game/types';

/** Renders the board as a 3x3 grid of buttons. Calls onCellClick with the cell index. */
export function renderBoard(
  container: HTMLElement,
  board: Board,
  onCellClick: (move: Move) => void,
): void {
  container.replaceChildren();
  container.className = 'board';

  board.forEach((cell, index) => {
    const button = document.createElement('button');
    button.className = 'cell';
    button.type = 'button';
    button.textContent = cell ?? '';
    button.setAttribute('aria-label', `Cell ${index + 1}${cell ? `, ${cell}` : ', empty'}`);
    button.addEventListener('click', () => onCellClick(index));
    container.appendChild(button);
  });
}
