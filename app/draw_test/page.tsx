'use client';

import { useEffect, useState } from 'react';
import TableDiagram from '../components/TableDiagram';
import { menuToColumns,  } from '../../lib/menuLayout';
import SideMenu from '../components/SideMenu';
import { ColumnCell, SWMS_Object, MenuItem } from '../../lib/types';
import { Layout } from 'antd';


export default function TestPage() {
  const [columns, setColumns] = useState<ColumnCell[]>([]);
  const [objectData, setObjectData] = useState<SWMS_Object[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);

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


  return (
    <Layout>
        <SideMenu menu={menu} />
        <TableDiagram columns={columns} objectData={objectData}  />
        
    </Layout>
  );
}
