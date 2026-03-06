'use client';

import { useRef, useEffect, useState } from 'react';
import { DOC_Object } from '../../lib/types';

/** Label that automatically switches to vertical text when wider than its container. */
function AutoRotateLabel({ text, color }: { text: string; color?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [vertical, setVertical] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !el.parentElement) return;
    // Compare the natural text width against the shaft's inner width
    if (el.scrollWidth > el.parentElement.clientWidth) {
      setVertical(true);
    }
  }, [text]);

  return (
    <span
      ref={ref}
      className={`apcom-label${vertical ? ' apcom-label--vertical' : ''}`}
      style={{ color }}
    >
      {text}
    </span>
  );
}

interface ApcomConnectorsProps {
  docs: DOC_Object[];
  columnCount: number;
  columnIds: string[];
  columnIdentifiers: Map<string, Set<string>>;
  columnColors: Map<string, string>;
}

/**
 * Renders a row of downward arrows between the TableDiagram columns and the ERP box.
 * Includes both APCOM arrows (full) and Interface arrows (top-half stub).
 */
export default function ApcomConnectors({
  docs,
  columnCount,
  columnIds,
  columnIdentifiers,
  columnColors,
}: ApcomConnectorsProps) {
  const apcomDocs = docs.filter(d => d.type_code === 'APCOM');
  const intrDocs = docs.filter(d => d.type_code === 'INTR');

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
    <div
      className="apcom-connectors"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
        gap: 16,
      }}
    >
      {columnIds.map(colId => {
        const apcomItems = apcomByColumn.get(colId) ?? [];
        const intrItems = intrByColumn.get(colId) ?? [];
        const color = columnColors.get(colId);

        if (apcomItems.length === 0 && intrItems.length === 0) {
          return <div key={colId} className="apcom-connector-cell" />;
        }

        const sortedApcom = apcomItems.sort(
          (a, b) => (a.sequence ?? Infinity) - (b.sequence ?? Infinity)
        );
        const sortedIntr = intrItems.sort(
          (a, b) => (a.sequence ?? Infinity) - (b.sequence ?? Infinity)
        );

        return (
          <div key={colId} className="apcom-connector-cell apcom-connector-cell--active">
            {/* APCOM: full block arrows */}
            {sortedApcom.map(item => (
              <div key={item.value_code} className="apcom-block-arrow" style={{ borderColor: color }}>
                <div className="apcom-block-shaft" style={{ borderColor: color }}>
                  <AutoRotateLabel text={item.value_code ?? ''} color={color} />
                </div>
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
            {/* Interface: top-half stub (upward arrowhead + shaft + label, open bottom) */}
            {sortedIntr.map(item => (
              <div key={`intr-${item.value_code}`} className="apcom-block-arrow" style={{ borderColor: color }}>
                <div className="apcom-block-head-wrapper">
                  <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="apcom-block-head-svg">
                    <polygon
                      points="50,0 0,50 100,50"
                      fill="white"
                      stroke={color}
                      strokeWidth="4"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="apcom-block-shaft apcom-block-shaft--open apcom-block-shaft--bottom" style={{ borderColor: color }}>
                  <AutoRotateLabel text={item.value_code ?? ''} color={color} />
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
