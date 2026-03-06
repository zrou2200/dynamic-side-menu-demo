'use client';

import { DOC_Object } from '../../lib/types';

interface InterfaceBoxProps {
  docs: DOC_Object[];
  columnIds: string[];
  columnIdentifiers: Map<string, Set<string>>;
  columnColors: Map<string, string>;
  columnCount: number;
}

/**
 * Renders interface (INTR) items in a box below the ERP diagram,
 * grouped into columns matching the menu columns above.
 */
export default function InterfaceBox({
  docs,
  columnIds,
  columnIdentifiers,
  columnColors,
  columnCount,
}: InterfaceBoxProps) {
  const intrDocs = docs
    .filter(d => d.type_code === 'INTR')
    .sort((a, b) => (a.sequence ?? Infinity) - (b.sequence ?? Infinity));

  if (intrDocs.length === 0) return null;

  // Group INTR docs by column id
  const intrByColumn = new Map<string, DOC_Object[]>();
  for (const doc of intrDocs) {
    for (const colId of columnIds) {
      const ids = columnIdentifiers.get(colId);
      if (ids && ids.has(doc.mapped_to ?? '')) {
        if (!intrByColumn.has(colId)) intrByColumn.set(colId, []);
        intrByColumn.get(colId)!.push(doc);
      }
    }
  }

  return (
    <div className="interface-box">
      <div className="interface-box-title">Interfaces</div>
      <div
        className="interface-box-grid"
        style={{
          gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
        }}
      >
        {columnIds.map(colId => {
          const items = intrByColumn.get(colId);
          const color = columnColors.get(colId);
          if (!items || items.length === 0) {
            return <div key={colId} className="interface-box-cell" />;
          }
          return (
            <div key={colId} className="interface-box-cell interface-box-cell--active">
              {items.map(item => (
                <div
                  key={item.value_code}
                  className="interface-card"
                  style={{ borderColor: color }}
                >
                  <div className="interface-card-label">{item.description}</div>
                  {/* <div className="interface-card-code">{item.value_code}</div> */}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
