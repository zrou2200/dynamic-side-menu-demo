import { MenuItem } from './menu';

export interface ColumnCell {
  id: string;
  lines: string[];
}

export interface ColumnData {
  id: string;
  cells: ColumnCell[];
}

export function menuToColumns(menuRoots: MenuItem[]): ColumnData[] {
  return menuRoots.map(root => ({
    id: String(root.id),
    cells: [
      // row 0 — the main menu
      {
        id: String(root.id),
        lines: [root.label],
      },

      // rows below — each child
      ...(root.children ?? []).map(child => ({
        id: String(child.id),
        lines: [
          child.label,
        ].filter(Boolean),
      })),
    ],
  }));
}
