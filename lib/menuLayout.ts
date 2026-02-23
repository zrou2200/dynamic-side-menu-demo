import Column from 'antd/es/table/Column';
import { MenuItem, ColumnCell  } from './types';



export function menuToColumns(menuRoots: MenuItem[]): ColumnCell[] {
  const filteredRoots = menuRoots.filter(
  r => Number(r.sort_order) < 10
  )

  return filteredRoots.map(root => {
    const groupMap = new Map<string, string[]>();


    (root.children ?? []).forEach(child => {
      const group = root.label ?? 'Other';

      if (!groupMap.has(group)) {
        groupMap.set(group, []);
      }

      groupMap.get(group)!.push(child.label);
    });

    const groups = Array.from(groupMap.entries()).map(
      ([title, lines], i) => ({
        id: `${root.id}-g-${i}`,
        title,
        lines,
      })
    );

    return {
      id: String(root.id),
      title: root.label,
      color: root.color,
      groups,
    };
  });
}
