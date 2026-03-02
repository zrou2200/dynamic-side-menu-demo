
'use client';

import { useState, useEffect } from 'react';
import { Layout, Menu, Typography, Button } from 'antd';
import {
  InboxOutlined,
  DatabaseOutlined,
  ShoppingCartOutlined,
  ToolOutlined,
  CarOutlined,
  TeamOutlined,
  SettingOutlined,
  TagOutlined,
  AuditOutlined,
  CodeOutlined,
  QuestionCircleOutlined,
  FileTextOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { MenuItem } from '../../lib/types';

const { Sider } = Layout;
const { Title } = Typography;

const ROUTE_ICON_MAP: Record<string, React.ReactNode> = {
  RECEIVING:        <InboxOutlined />,
  INVENTORY:        <DatabaseOutlined />,
  ORDER:            <ShoppingCartOutlined />,
  MAINTENANCE:      <ToolOutlined />,
  'DRIVER-CHECK-IN': <CarOutlined />,
  LABOR:            <TeamOutlined />,
  ADMIN_TOOL:       <SettingOutlined />,
  SWMS_VERSION:     <TagOutlined />,
  SWMS_AUDIT:       <AuditOutlined />,
  TECSTACK:         <CodeOutlined />,
  SUPPORT:          <QuestionCircleOutlined />,
};

const getParentIcon = (route: string) =>
  ROUTE_ICON_MAP[route] ?? <FileTextOutlined />;

const buildAntdMenuItems = (items: MenuItem[]): MenuProps['items'] =>
  items.map(item => ({
    key: item.id,
    label: item.label,
    icon: getParentIcon(item.route),
    popupClassName: 'side-menu-test-popup',
    children: item.children?.map(child => ({
      key: child.id,
      label: (
        <a
          href={child.object_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {child.label}
        </a>
      ),
      icon: <FileTextOutlined />,
    })),
  }));

interface SideMenuTestProps {
  menu: MenuItem[];
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

const POPUP_STYLE_ID = 'side-menu-test-popup-styles';

export default function SideMenuTest({ menu, collapsed: controlledCollapsed, onCollapse }: SideMenuTestProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const collapsed = controlledCollapsed ?? internalCollapsed;

  const handleCollapse = (value: boolean) => {
    setInternalCollapsed(value);
    onCollapse?.(value);
  };

  // Inject popup styles into <head> after Ant Design's CSS-in-JS loads
  useEffect(() => {
    if (document.getElementById(POPUP_STYLE_ID)) return;
    const styleEl = document.createElement('style');
    styleEl.id = POPUP_STYLE_ID;
    styleEl.textContent = `
      .side-menu-test-popup .ant-menu-title-content,
      .ant-menu-submenu-popup .ant-menu-title-content {
        display: inline-block !important;
        opacity: 1 !important;
        visibility: visible !important;
        width: auto !important;
        max-width: none !important;
        overflow: visible !important;
      }
      .side-menu-test-popup .ant-menu-title-content a,
      .ant-menu-submenu-popup .ant-menu-title-content a {
        color: rgba(255, 255, 255, 0.85) !important;
        text-decoration: none !important;
      }
      .side-menu-test-popup .ant-menu-title-content a:hover,
      .ant-menu-submenu-popup .ant-menu-title-content a:hover {
        color: #ffffff !important;
      }
      .side-menu-test-popup .ant-menu-item,
      .ant-menu-submenu-popup .ant-menu-item {
        display: flex !important;
        align-items: center !important;
      }
    `;
    document.head.appendChild(styleEl);
    return () => {
      const el = document.getElementById(POPUP_STYLE_ID);
      if (el) el.remove();
    };
  }, []);

  return (
    <Sider
      width="18.75rem"
      collapsedWidth={60}
      collapsible
      collapsed={collapsed}
      onCollapse={handleCollapse}
      trigger={null}
      className="app-navigation"
    >
      <Button
        type="text"
        className="menu-trigger-button"
        onClick={() => handleCollapse(!collapsed)}
        icon={collapsed ? <RightOutlined /> : <LeftOutlined />}
      />
      {!collapsed && (
        <div className="logo" style={{ padding: '1rem', textAlign: 'center' }}>
          <Title level={3} style={{ margin: 0, color: 'white' }}>
            SWMS Documentation
          </Title>
        </div>
      )}
      <Menu
        mode="inline"
        items={buildAntdMenuItems(menu)}
        className="app-menu"
        theme='dark'
      />
    </Sider>
  );
}
