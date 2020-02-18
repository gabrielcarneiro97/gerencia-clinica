import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Tabs } from 'antd';

import PacienteDadosTabs from './PacienteDadosTabs';

import { Store } from '../store/store';
import PacienteConsultasTable from './PacienteConsultasTable';

import { PacienteStore } from '../store/paciente';


const { TabPane } = Tabs;

export default function PacienteTabs(): JSX.Element {
  const pacienteStore = useSelector<Store, PacienteStore>(
    (state) => state.paciente,
  );

  const { paciente } = pacienteStore;

  const [activeTab, setActiveTab] = useState('1');

  const pacienteNoBanco = paciente && paciente.id;

  useEffect(() => {
    if (!pacienteNoBanco) setActiveTab('1');
  }, [pacienteNoBanco]);

  return (
    <Tabs activeKey={activeTab} onTabClick={setActiveTab}>
      <TabPane
        key="1"
        tab="Dados"
        disabled={!paciente}
      >
        {
          paciente
          && <PacienteDadosTabs />
        }
      </TabPane>
      <TabPane
        key="2"
        tab="Consultas"
        disabled={!pacienteNoBanco}
      >
        <PacienteConsultasTable />
      </TabPane>
    </Tabs>
  );
}
