import React, { useState } from 'react';
import { Row, Tabs } from 'antd';
import PacienteBuscaMain from './PacienteBuscaMain';
import TodosPacientesMain from './TodosPacientesMain';

const { TabPane } = Tabs;

export default function PacientesTabs(): JSX.Element {
  const [activeTab, setActiveTab] = useState('1');

  return (
    <Row>
      <Tabs activeKey={activeTab} onTabClick={setActiveTab}>
        <TabPane
          key="1"
          tab="Buscar Paciente"
        >
          <PacienteBuscaMain />
        </TabPane>
        <TabPane
          key="2"
          tab="Todos Pacientes"
        >
          <TodosPacientesMain />
        </TabPane>
      </Tabs>
    </Row>
  );
}
