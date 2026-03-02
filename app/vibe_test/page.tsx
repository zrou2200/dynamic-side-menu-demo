'use client';

import { useEffect, useState } from 'react';
import { Layout } from 'antd';
import SideMenuTest from '../components/SideMenuTest';
import CollapsibleSubgroup from '../components/CollapsibleSubgroup';
import ErpDiagram from '../components/ErpDiagram';
import ApcomConnectors from '../components/ApcomConnectors';
import { menuToColumns } from '../../lib/menuLayout';
import { ColumnCell, SWMS_Object, MenuItem, DOC_Object, SubmenuGroup } from '../../lib/types';

export default function VibeTestPage() {
  const [columns, setColumns] = useState<ColumnCell[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [objectData, setObjectData] = useState<SWMS_Object[]>([]);
  const [docsData, setDocsData] = useState<DOC_Object[]>([]);
  const [siderCollapsed, setSiderCollapsed] = useState(false);

  useEffect(() => {
    fetch('/api/menu')
      .then(r => r.json())
      .then(menuTree => {
        const computedColumns = menuToColumns(menuTree);
        setColumns(computedColumns);
        setMenu(menuTree);
      });
  }, []);

  useEffect(() => {
    fetch('/api/object')
      .then(r => r.json())
      .then(objectTree => {
        setObjectData(objectTree);
      });
  }, []);

  useEffect(() => {
    fetch('/api/docs')
      .then(r => r.json())
      .then((docs: DOC_Object[]) => {
        setDocsData(docs);
      });
  }, []);

  // Build a lookup: column id -> all possible identifiers (route, label, id)
  // so we can match mapped_to against any of them
  const columnIdentifiers = new Map<string, Set<string>>();
  menu.forEach(root => {
    const colId = String(root.id);
    const ids = new Set<string>();
    ids.add(root.label);            // menu label (title)
    ids.add(root.route);            // SUBMENU route name
    ids.add(colId);                 // numeric id
    if (root.parent_name) ids.add(root.parent_name);
    columnIdentifiers.set(colId, ids);
  });

  // Build a map: mapped_to -> { type_code -> DOC_Object[] }
  const docsByMappedTo = docsData.reduce<Record<string, Record<string, DOC_Object[]>>>((acc, doc) => {
    const key = doc.mapped_to ?? '';
    if (!acc[key]) acc[key] = {};
    if (!acc[key][doc.type_code]) acc[key][doc.type_code] = [];
    acc[key][doc.type_code].push(doc);
    return acc;
  }, {});

  // Merge doc-based submenu groups into each column
  const enrichedColumns: ColumnCell[] = columns.map(col => {
    // Match mapped_to against route, label, or id
    const identifiers = columnIdentifiers.get(col.id) ?? new Set<string>();

    // Collect all docs whose mapped_to matches any identifier for this column
    const mergedTypeCodeGroups: Record<string, DOC_Object[]> = {};
    for (const [mappedTo, typeCodeMap] of Object.entries(docsByMappedTo)) {
      if (identifiers.has(mappedTo)) {
        for (const [typeCode, docs] of Object.entries(typeCodeMap)) {
          if (!mergedTypeCodeGroups[typeCode]) mergedTypeCodeGroups[typeCode] = [];
          mergedTypeCodeGroups[typeCode].push(...docs);
        }
      }
    }

    const docGroups: SubmenuGroup[] = Object.entries(mergedTypeCodeGroups)
      .filter(([typeCode]) => typeCode !== 'APCOM')
      .map(
        ([typeCode, docs], i) => {
          const sorted = docs.sort((a, b) => (a.sequence ?? Infinity) - (b.sequence ?? Infinity));
          return {
            id: `${col.id}-doc-${i}`,
            title: typeCode,
            lines: sorted.map(d => d.description || d.value_code),
            maxVisible: 6,
          };
        }
      );

    return {
      ...col,
      groups: [...col.groups, ...docGroups],
    };
  });

  return (
    <Layout>
      <SideMenuTest menu={menu} collapsed={siderCollapsed} onCollapse={setSiderCollapsed} />
      <div className="diagram-wrapper" style={{ transition: 'margin-left 0.2s ease, width 0.2s ease', flex: 1 }}>
        <h1 className="diagram-title">SWMS at a Glance</h1>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${enrichedColumns.length}, 1fr)`,
            gap: 16,
            alignItems: 'stretch',
          }}
        >
          {enrichedColumns.map(column => (
            <div
              key={column.id}
              className="menu-cell"
              style={{
                background: column.color,
                maxWidth: 'none',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div className="menu-main-title">{column.title}</div>

              {column.groups.map(group => (
                <CollapsibleSubgroup key={group.id} group={group} />
              ))}

              {column.id === '18001' && (
                <CollapsibleSubgroup
                  group={{
                    id: '18888',
                    title: 'SWMS Database Objects',
                    lines: objectData.map(obj => `${obj.count}   ${obj.object_name}`),
                  }}
                />
              )}
            </div>
          ))}
        </div>
        <ApcomConnectors
          docs={docsData}
          columnCount={enrichedColumns.length}
          columnIds={enrichedColumns.map(c => c.id)}
          columnIdentifiers={columnIdentifiers}
        />
        <ErpDiagram docs={docsData} />
      </div>
    </Layout>
  );
}
