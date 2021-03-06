import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Layout } from 'antd';

import PacienteHead from './PacienteHead';
import PacienteBuscaTabs from './PacienteBuscaTabs';
import { limparPaciente } from '../store/paciente';
import PacientesTabs from './PacientesTabs';

export default function PacientesMain(): JSX.Element {
  const dispatch = useDispatch();

  useEffect(() => () => {
    dispatch(limparPaciente());
  }, []);

  return (
    <Layout>
      <PacientesTabs />
    </Layout>
  );
}
