'use client';

import { ConfigProvider, Layout } from 'antd';
import SideMenu from './components/SideMenu';
import Image from 'next/image';
import logo from '../styles/resources/images/SWMSAtAGlance.png';
import { menuToColumns } from '@/lib/menuLayout';
import { ColumnCell, MenuItem } from '@/lib/types';
import { useState, useEffect } from 'react';


export default function HomePage() {
  const [columns, setColumns] = useState<ColumnCell[]>([]);
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
  
  
  return (
     
     <div style={{ position: 'relative', zIndex: 1 }}>
      <Layout >
        <SideMenu menu={menu}/>

        <Layout>
          
          <a
            href="https://syscobt.atlassian.net/wiki/spaces/SWMS/pages/264012989/SWMS+a+Glance"
            target="_blank"
            rel="noopener noreferrer"
          >
          <Image
            src={logo}
            alt="Logo"
            // width={200}
            // height={50}
            style={{ margin: '1rem' }}
          />

          </a>
          
        </Layout>
      </Layout>
      </div>
  );
}
