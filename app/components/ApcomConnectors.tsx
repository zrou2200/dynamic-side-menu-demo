'use client';

import { DOC_Object } from '../../lib/types';

interface ApcomConnectorsProps {
  docs: DOC_Object[];
  columnCount: number;
  columnIds: string[];
  columnIdentifiers: Map<string, Set<string>>;
}

/**
 * Renders a row of downward arrows between the TableDiagram columns and the ERP box.
 * Each column that has APCOM docs gets arrows labeled with value_code.
 */
export default function ApcomConnectors({
  docs,
  columnCount,
  columnIds,
  columnIdentifiers,
}: ApcomConnectorsProps) {
  const apcomDocs = docs.filter(d => d.type_code === 'APCOM');

  // Group APCOM docs by column id
  const apcomByColumn = new Map<string, DOC_Object[]>();
  for (const doc of apcomDocs) {
    for (const colId of columnIds) {
      const ids = columnIdentifiers.get(colId);
      if (ids && ids.has(doc.mapped_to ?? '')) {
        if (!apcomByColumn.has(colId)) apcomByColumn.set(colId, []);
        apcomByColumn.get(colId)!.push(doc);
      }
    }
  }

  return (
    <div
      className="apcom-connectors"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
        gap: 16,
      }}
    >
      {columnIds.map(colId => {
        const items = apcomByColumn.get(colId);
        if (!items || items.length === 0) {
          return <div key={colId} className="apcom-connector-cell" />;
        }

        const sorted = items.sort(
          (a, b) => (a.sequence ?? Infinity) - (b.sequence ?? Infinity)
        );

        return (
          <div key={colId} className="apcom-connector-cell apcom-connector-cell--active">
            {sorted.map(item => (
              <div key={item.value_code} className="apcom-single-arrow">
                <span className="apcom-label">{item.value_code}</span>
                <div className="apcom-arrow">
                  <div className="apcom-arrow-line" />
                  <div className="apcom-arrow-head" />
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
