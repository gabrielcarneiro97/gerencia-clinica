import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Tabs } from 'antd';

import PacienteDadosTabs from './PacienteDadosTabs';

import { Store } from '../store/store';
import Paciente from '../../electron/backend/db/models/Paciente';
import PacienteConsultasTable from './PacienteConsultasTable';


const { TabPane } = Tabs;

export default function PacienteTabs(): JSX.Element {
  const infosPessoais = useSelector<Store, Paciente | null>(
    (state) => state.paciente.infosPessoais,
  );

  const [activeTab, setActiveTab] = useState('1');

  const pacienteNoBanco = infosPessoais && infosPessoais.getDataValue('id');

  useEffect(() => {
    if (!pacienteNoBanco) setActiveTab('1');
  }, [pacienteNoBanco]);

  return (
    <Tabs activeKey={activeTab} onTabClick={setActiveTab}>
      <TabPane
        key="1"
        tab="Dados"
        disabled={!infosPessoais}
      >
        {
          infosPessoais
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
