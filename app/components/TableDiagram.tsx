import { ColumnData } from "@/lib/menuLayout";

type Props = {
  columns: ColumnData[];
};

export default function TableDiagram({ columns }: Props) {
  return (
    <div
      className="table-diagram"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns.length}, 1fr)`,
        gap: 16,
      }}
    >
      {columns.map(col => (
        <div key={col.id} className="menu-column">
          {col.cells.map(cell => (
            <div key={cell.id} className="diagram-cell">
              {cell.lines.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
