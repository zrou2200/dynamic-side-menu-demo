import { ConfigProvider, Layout } from 'antd';
import SideMenu from './components/SideMenu';
import Image from 'next/image';
import logo from '../styles/resources/images/SWMSAtAGlance.png';


export default function HomePage() {
  return (
     
     <div style={{ position: 'relative', zIndex: 1 }}>
      <Layout >
        <SideMenu />

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
