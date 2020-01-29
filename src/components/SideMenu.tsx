import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Icon } from 'antd';


export default function SideMenu(): JSX.Element {
  const location = useLocation();
  const { pathname } = location;

  return (
    <Menu
      mode="inline"
      selectedKeys={[pathname.split('?')[0]]}
      style={{ height: '92%', borderRight: 0, backgroundColor: 'white' }}
    >
      <Menu.Item key="/pacientes">
        <Link to="/pacientes">
          <Icon type="team" />
          Pacientes
        </Link>
      </Menu.Item>
      <Menu.Item key="/agenda">
        <Link to="/agenda">
          <Icon type="calendar" />
          Agenda
        </Link>
      </Menu.Item>
    </Menu>
  );
}
