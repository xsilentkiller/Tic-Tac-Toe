export type Symbol = 'X' | 'O';
export type Cell = Symbol | null;

/** 9 cells, row-major: index = row * 3 + col. */
export type Board = readonly Cell[];

/** A move is the index (0-8) of the cell to fill. */
export type Move = number;
