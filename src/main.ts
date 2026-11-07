import './ui/styles.css';
import { createBoard } from './game/board';
import { renderBoard } from './ui/boardView';

const app = document.getElementById('app')!;
const boardEl = document.createElement('div');
app.appendChild(boardEl);

// Milestone 1: just draw an empty board. Game flow arrives in later milestones.
renderBoard(boardEl, createBoard(), () => {});
