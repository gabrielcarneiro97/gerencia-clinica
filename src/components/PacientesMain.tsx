import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Layout } from 'antd';

import PacienteHead from './PacienteHead';
import PacienteTabs from './PacienteTabs';
import { limparPaciente } from '../store/paciente';

export default function PacientesMain(): JSX.Element {
  const dispatch = useDispatch();

  useEffect(() => () => {
    dispatch(limparPaciente());
  }, []);

  return (
    <Layout>
      <PacienteHead />
      <PacienteTabs />
    </Layout>
  );
}
