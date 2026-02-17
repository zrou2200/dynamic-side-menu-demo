'use client';

import { useEffect, useState } from 'react';
import TableDiagram from '../components/TableDiagram';
import { ColumnData, menuToColumns,  } from '../../lib/menuLayout';
import SideMenu from '../components/SideMenu';
import { Layout } from 'antd';

export default function TestPage() {
  const [columns, setColumns] = useState<ColumnData[]>([]);

  useEffect(() => {
    fetch('/api/menu')
      .then(r => r.json())
      .then(menuTree => {
        const computedColumns = menuToColumns(menuTree);
        setColumns(computedColumns);
      });
  }, []);

  return (
    <Layout>
        <SideMenu />
        <TableDiagram columns={columns} />
    </Layout>
  );
}
