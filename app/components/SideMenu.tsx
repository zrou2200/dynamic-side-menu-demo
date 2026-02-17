
'use client';

import { Layout, Menu, Typography, ConfigProvider } from 'antd';
import {
  AppstoreOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';



const { Sider } = Layout;
const { Title } = Typography;

export interface MenuItem {
  id: number;
  label: string;
  route: string;
  parent_menu: string;
  sort_order?: number;
  object_url?: string;
  children?: MenuItem[];
}

const buildAntdMenuItems = (items: MenuItem[]): MenuProps['items'] =>
  items.map(item => ({
    key: item.id, // Ensure unique keys
    label: item.label,
    icon: <AppstoreOutlined />,
    children: item.children?.map(child => ({
      key: child.id, // Ensure unique keys
      label: (
      <a
        href={child.object_url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {child.label}
      </a>),
      url: child.object_url, // Use object_url for navigation
      icon: <SettingOutlined />,
    })),
}));

export default function SideMenu() {
    const [menu, setMenu] = useState<MenuItem[]>([]);
    
    const router = useRouter();

    useEffect(() => {
        fetch('/api/menu')
        .then(res => res.json())
        .then(setMenu);
    }, []);
  
    return (
    <Sider width="18.75rem" className="app-navigation">
        <div className="logo" style={{ padding: '1rem', textAlign: 'center' }}>
          <Title level={3} style={{ margin: 0, color: 'white' }}>
            SWMS Documentation
          </Title>
        </div>
      <Menu
        mode="inline"
        items={buildAntdMenuItems(menu)}
        //onClick={handleClick}
        className="app-menu"
         theme='dark'
        //style={{ background: '#008cd2' }}
      />
    </Sider>

  );
}
