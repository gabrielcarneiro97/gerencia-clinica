import React from 'react';
import { Layout } from 'antd';

import PacienteHead from './PacienteHead';
import PacienteTabs from './PacienteTabs';

export default function PacientesMain(): JSX.Element {
  return (
    <Layout>
      <PacienteHead />
      <PacienteTabs />
    </Layout>
  );
}
