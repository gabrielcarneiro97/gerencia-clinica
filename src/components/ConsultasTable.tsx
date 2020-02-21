import React, { useState, useEffect } from 'react';
import { Table, Row } from 'antd';
import moment from 'moment';
import { hooks } from '../services/graphql.service';
import { Paciente } from '../types';
import ReloadButton from './ReloadButton';

function useConsultas() {
  const [dataSource, setDataSource] = useState<any[]>([]);
  const { data, loading, refetch } = hooks.useConsultasPaciente();

  useEffect(() => {
    if (data && !loading) {
      const { consultas } = data;
      setDataSource(consultas);
    }
  }, [data, loading]);

  const refresh = () => refetch();

  return { dataSource, refresh, loading };
}

function useComponent() {
  const { dataSource, refresh, loading } = useConsultas();

  const columns = [
    {
      key: 'data',
      dataIndex: 'data',
      title: 'Data',
      render: (data: string) => moment(data).format('DD/MM/YYYY HH:mm'),
    },
    {
      key: 'nome',
      dataIndex: 'paciente',
      title: 'Paciente',
      render: (paciente: Paciente) => paciente.nome,
    },
    {
      key: 'responsavel',
      dataIndex: 'responsavel',
      title: 'Responsável',
    },
  ];

  return {
    state: {
      dataSource,
      loading,
      columns,
    },
    methods: {
      refresh,
    },
  };
}

export default function ConsultasTable(): JSX.Element {
  const { state, methods } = useComponent();

  const {
    loading, dataSource, columns,
  } = state;
  const { refresh } = methods;

  return (
    <>
      <Row
        type="flex"
        justify="end"
        style={{
          marginBottom: 10,
        }}
      >
        <ReloadButton
          onClick={refresh}
        />
      </Row>
      <Row>
        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={dataSource}
        />
      </Row>
    </>
  );
}
