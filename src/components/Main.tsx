import React from 'react';
import { Layout } from 'antd';

import Head from './Head';
import Router from './Router';
import SideMenu from './SideMenu';

const {
  Header, Sider, Content, Footer,
} = Layout;

export default function Main(): JSX.Element {
  return (
    <Layout>
      <Header>
        <Head />
      </Header>
      <Layout>
        <Sider collapsed style={{ background: '#fff' }}>
          <SideMenu />
        </Sider>
        <Layout>
          <Content
            style={{
              padding: 12,
              margin: 0,
              minHeight: window.innerHeight - 64 /* altura header */ - 69 /* altura footer */,
            }}
          >
            <Router />
          </Content>
        </Layout>
      </Layout>
      <Footer>
        <div>Teste</div>
      </Footer>
    </Layout>
  );
}
