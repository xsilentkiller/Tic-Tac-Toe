import type { Board, Move } from '../game/types';

// Remembers the last board drawn in each container, so only newly placed pieces animate.
const previousBoards = new WeakMap<HTMLElement, Board>();

/** Renders the board as a 3x3 grid of buttons. Calls onCellClick with the cell index. */
export function renderBoard(
  container: HTMLElement,
  board: Board,
  onCellClick: (move: Move) => void,
  winningLine: readonly number[] | null = null,
): void {
  const previous = previousBoards.get(container);
  previousBoards.set(container, board);

  container.replaceChildren();
  container.className = 'board';

  board.forEach((cell, index) => {
    const button = document.createElement('button');
    button.className = 'cell';
    if (cell) button.classList.add(cell === 'X' ? 'x' : 'o');
    if (cell && previous && previous[index] !== cell) button.classList.add('placed');
    if (winningLine?.includes(index)) button.classList.add('win');
    button.type = 'button';
    button.textContent = cell ?? '';
    button.setAttribute('aria-label', `Cell ${index + 1}${cell ? `, ${cell}` : ', empty'}`);
    button.addEventListener('click', () => onCellClick(index));
    container.appendChild(button);
  });
}
