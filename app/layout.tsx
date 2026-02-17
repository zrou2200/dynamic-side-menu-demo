'use client';

import 'antd/dist/reset.css';
import '../styles/App.scss';

import { ConfigProvider, Layout } from 'antd';
import SideMenu from './components/SideMenu';
import Image from 'next/image';
import logo from '../styles/resources/images/SWMSAtAGlance.png';

const { Content } = Layout;


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
  <html lang="en">
    <body >
      <ConfigProvider
        theme={{
          token: {
            fontFamily: "Myriad Pro, sans-serif",

          },
        }}
      >
          
          <Content style={{ position: 'relative', minHeight: '100vh' }}>
            
            {children}
            
          </Content>

      </ConfigProvider>
    </body>
  </html>
);
}