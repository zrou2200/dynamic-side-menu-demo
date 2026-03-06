'use client';

import { DOC_Object } from '../../lib/types';

interface InterfaceConnectorsProps {
  docs: DOC_Object[];
  columnCount: number;
  columnIds: string[];
  columnIdentifiers: Map<string, Set<string>>;
  columnColors: Map<string, string>;
}

/**
 * Renders the bottom half of interface arrows (below the ERP diagram).
 * Adds invisible spacers for APCOM arrow positions so that interface
 * arrows align vertically with their top-half stubs in ApcomConnectors.
 */
export default function InterfaceConnectors({
  docs,
  columnCount,
  columnIds,
  columnIdentifiers,
  columnColors,
}: InterfaceConnectorsProps) {
  const intrDocs = docs.filter(d => d.type_code === 'INTR');
  const apcomDocs = docs.filter(d => d.type_code === 'APCOM');

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

  // Count APCOM docs per column (for spacers)
  const apcomCountByColumn = new Map<string, number>();
  for (const doc of apcomDocs) {
    for (const colId of columnIds) {
      const ids = columnIdentifiers.get(colId);
      if (ids && ids.has(doc.mapped_to ?? '')) {
        apcomCountByColumn.set(colId, (apcomCountByColumn.get(colId) ?? 0) + 1);
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
        const items = intrByColumn.get(colId);
        const color = columnColors.get(colId);
        const apcomCount = apcomCountByColumn.get(colId) ?? 0;

        if (!items || items.length === 0) {
          return <div key={colId} className="apcom-connector-cell" />;
        }

        const sorted = items.sort(
          (a, b) => (a.sequence ?? Infinity) - (b.sequence ?? Infinity)
        );

        return (
          <div key={colId} className="apcom-connector-cell apcom-connector-cell--active">
            {/* Invisible spacers matching the APCOM arrow positions above */}
            {Array.from({ length: apcomCount }).map((_, i) => (
              <div key={`spacer-${i}`} className="apcom-block-arrow" style={{ visibility: 'hidden' }} />
            ))}
            {/* Interface: bottom-half arrows (upward arrowhead at top + shaft + downward arrowhead) */}
            {sorted.map(item => (
              <div key={item.value_code} className="apcom-block-arrow" style={{ borderColor: color }}>
                <div className="apcom-block-shaft apcom-block-shaft--open apcom-block-shaft--bottom" style={{ borderColor: color }} />
                <div className="apcom-block-head-wrapper">
                  <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="apcom-block-head-svg">
                    <polygon
                      points="0,0 100,0 50,50"
                      fill="white"
                      stroke={color}
                      strokeWidth="4"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
