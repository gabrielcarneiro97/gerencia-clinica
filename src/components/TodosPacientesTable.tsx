import React, { useState, useEffect } from 'react';
import { Table, Row } from 'antd';
import moment from 'moment';
import { hooks } from '../services/graphql.service';
import TodosPacientesTableReloadBtn from './TodosPacientesTableReloadBtn';
import { PacienteGrupo, Paciente } from '../types';

function usePacientes() {
  const [dataSource, setDataSource] = useState<any[]>([]);

  const { data, loading, refetch } = hooks.usePacientes();

  useEffect(() => {
    if (data && !loading) {
      const { pacientes } = data;

      setDataSource(pacientes);
    }
  }, [data, loading]);

  const refresh = () => refetch();

  return {
    dataSource,
    refresh,
    loading,
  };
}

function usePacienteGrupos() {
  const [grupos1, setGrupos1] = useState<any[]>([]);
  const [grupos2, setGrupos2] = useState<any[]>([]);

  const { data, loading } = hooks.usePacienteGrupos();

  useEffect(() => {
    if (data && !loading) {
      const { pacienteGrupos } = data;
      const g1: any[] = [];
      const g2: any[] = [];

      pacienteGrupos.forEach((g) => {
        if (g.tipo === 1) g1.push({ text: g.descricao, value: g.id });
        else g2.push({ text: g.descricao, value: g.id });
      });

      setGrupos1(g1);
      setGrupos2(g2);
    }
  }, [data, loading]);

  return { grupos1, grupos2 };
}

function useComponent() {
  const { dataSource, refresh, loading } = usePacientes();
  const { grupos1, grupos2 } = usePacienteGrupos();

  const columns = [
    {
      key: 'nome',
      dataIndex: 'nome',
      title: 'Paciente',
    },
    {
      key: 'grupo2',
      dataIndex: 'grupo2',
      title: 'Pré/Pós',
      filters: grupos2,
      onFilter: (value: number, record: Paciente) => record?.grupo2?.id === value,
      render: (grupo: PacienteGrupo) => grupo.descricao,
    },
    {
      key: 'grupo1',
      dataIndex: 'grupo1',
      title: 'Tipo de Transplante',
      filters: grupos1,
      onFilter: (value: number, record: Paciente) => record?.grupo1?.id === value,
      render: (grupo: PacienteGrupo) => grupo.descricao,
    },
    {
      key: 'primeiraConsulta',
      dataIndex: 'primeiraConsulta',
      title: 'Primeira Consulta',
      render: (data: string): string => moment(data).format('DD/MM/YYYY HH:mm'),
    },
  ];

  return {
    state: {
      dataSource,
      loading,
      columns,
      grupos1,
      grupos2,
    },
    methods: {
      refresh,
    },
  };
}

export default function TodosPacientesTable(): JSX.Element {
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
        <TodosPacientesTableReloadBtn
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
