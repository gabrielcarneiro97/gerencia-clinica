import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Icon } from 'antd';

const { Item } = Menu;

export default function SideMenu(): JSX.Element {
  const location = useLocation();
  const { pathname } = location;

  return (
    <Menu
      mode="inline"
      selectedKeys={[pathname.split('?')[0]]}
      style={{ height: '92%', borderRight: 0, backgroundColor: 'white' }}
    >
      <Item key="/pacientes" title="Pacientes">
        <Link to="/pacientes">
          <Icon type="team" />
        </Link>
      </Item>
      <Item key="/agenda" title="Agenda">
        <Link to="/agenda">
          <Icon type="calendar" />
        </Link>
      </Item>
      <Item key="/consultas" title="Consultas">
        <Link to="/consultas">
          <Icon type="medicine-box" />
        </Link>
      </Item>
    </Menu>
  );
}
