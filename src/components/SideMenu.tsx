import React, { useState } from 'react';
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
      <Menu.Item key="/pacientes" title="Pacientes">
        <Link to="/pacientes">
          <Icon type="team" />
        </Link>
      </Menu.Item>
      <Menu.Item key="/agenda" title="Agenda">
        <Link to="/agenda">
          <Icon type="calendar" />
        </Link>
      </Menu.Item>
    </Menu>
  );
}
