'use client';

import { useEffect, useState } from 'react';
import { Layout } from 'antd';
import SideMenuTest from '../components/SideMenuTest';
import CollapsibleSubgroup from '../components/CollapsibleSubgroup';
import ErpDiagram from '../components/ErpDiagram';
import ApcomConnectors from '../components/ApcomConnectors';
import InterfaceConnectors from '../components/InterfaceConnectors';
import InterfaceBox from '../components/InterfaceBox';
import SysparBox from '../components/SysparBox';
import AuthBox from '../components/AuthBox';
import { menuToColumns } from '../../lib/menuLayout';
import { ColumnCell, SWMS_Object, MenuItem, DOC_Object, SubmenuGroup, SYSPAR_Object } from '../../lib/types';

export default function VibeTestPage() {
  const [columns, setColumns] = useState<ColumnCell[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [objectData, setObjectData] = useState<SWMS_Object[]>([]);
  const [docsData, setDocsData] = useState<DOC_Object[]>([]);
  const [siderCollapsed, setSiderCollapsed] = useState(false);
  const [sysparData, setSysparData] = useState<SYSPAR_Object[]>([]);

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

  useEffect(() => {
    fetch('/api/syspar')
      .then(r => r.json())
      .then((syspars: SYSPAR_Object[]) => {
        setSysparData(syspars);
      });
  }, []);

  // Convert raw type_code values (e.g. "TRANS_TYPE", "AUTH") to readable headings
  const TYPE_CODE_LABELS: Record<string, string> = {
    TRANS_TYPE: 'Transactions',
    AUTH:       'Authorizations',
    INTR:       'Interfaces',
    ERP:        'ERP Systems',
    APCOM:      'APCOM Connectors',
  };
  const humanizeTypeCode = (code: string): string =>
    TYPE_CODE_LABELS[code] ??
    code
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, c => c.toUpperCase());

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

  // Group syspars by mapped_to, matched to columns via identifiers
  const sysparsByColumn = new Map<string, SYSPAR_Object[]>();
  for (const sp of sysparData) {
    const mappedTo = sp.mapped_to ?? '';
    for (const [colId, ids] of columnIdentifiers.entries()) {
      if (ids.has(mappedTo)) {
        if (!sysparsByColumn.has(colId)) sysparsByColumn.set(colId, []);
        sysparsByColumn.get(colId)!.push(sp);
      }
    }
  }

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
      .filter(([typeCode]) => typeCode !== 'APCOM' && typeCode !== 'INTR' && typeCode !== 'AUTH')
      .map(
        ([typeCode, docs], i) => {
          const sorted = docs.sort((a, b) => (a.sequence ?? Infinity) - (b.sequence ?? Infinity));
          return {
            id: `${col.id}-doc-${i}`,
            title: humanizeTypeCode(typeCode),
            lines: sorted.map(d => d.description || d.value_code),
            maxVisible: 6,
          };
        }
      );

    return {
      ...col,
      groups: [...col.groups.slice(1), ...docGroups],
    };
  });

  // Group AUTH docs by column id
  const authsByColumn = new Map<string, DOC_Object[]>();
  for (const doc of docsData.filter(d => d.type_code === 'AUTH')) {
    for (const [colId, ids] of columnIdentifiers.entries()) {
      if (ids.has(doc.mapped_to ?? '')) {
        if (!authsByColumn.has(colId)) authsByColumn.set(colId, []);
        authsByColumn.get(colId)!.push(doc);
      }
    }
  }

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
          {enrichedColumns.map(column => {
            const colSyspars = sysparsByColumn.get(column.id) ?? [];
            const colAuths = authsByColumn.get(column.id) ?? [];
            const isTechStack = column.id === '18001';
            return (
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
                <div className="menu-main-title">
                  {column.title}
                  {!isTechStack && colAuths.length > 0 && (
                    <AuthBox auths={colAuths} color={column.color} />
                  )}
                </div>

                {colSyspars.length > 0 && (
                  <SysparBox syspars={colSyspars} color={column.color} />
                )}

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
            );
          })}
        </div>
        <ApcomConnectors
          docs={docsData}
          columnCount={enrichedColumns.length}
          columnIds={enrichedColumns.map(c => c.id)}
          columnIdentifiers={columnIdentifiers}
          columnColors={new Map(enrichedColumns.map(c => [c.id, c.color ?? '#008cd2']))}
        />
        <ErpDiagram docs={docsData} />
        <InterfaceConnectors
          docs={docsData}
          columnCount={enrichedColumns.length}
          columnIds={enrichedColumns.map(c => c.id)}
          columnIdentifiers={columnIdentifiers}
          columnColors={new Map(enrichedColumns.map(c => [c.id, c.color ?? '#008cd2']))}
        />
        <InterfaceBox
          docs={docsData}
          columnIds={enrichedColumns.map(c => c.id)}
          columnIdentifiers={columnIdentifiers}
          columnColors={new Map(enrichedColumns.map(c => [c.id, c.color ?? '#008cd2']))}
          columnCount={enrichedColumns.length}
        />
      </div>
    </Layout>
  );
}
