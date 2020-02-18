import React from 'react';
import { useSelector } from 'react-redux';

import {
  Table, Row, Col,
} from 'antd';

import moment from 'moment';

import { Store } from '../store/store';

import { PacienteStore } from '../store/paciente';
import ConsultaModal from './ConsultaModal';
import ConsultaDeleteButton from './ConsultaDeleteButton';

import { Consulta } from '../types';

export default function PacienteConsultasTable(): JSX.Element {
  const pacienteStore = useSelector<Store, PacienteStore>((store) => store.paciente);

  const { paciente } = pacienteStore;

  const { consultas } = paciente;

  const pacienteId = paciente.id;
  const temConsultas = consultas.length > 0;

  const header = (): JSX.Element => (
    <Row gutter={8}>
      <Col span={12}>
        <div style={{ fontWeight: 'bold', fontSize: 'medium' }}>
          Consultas
        </div>
      </Col>
      <Col span={12} style={{ textAlign: 'end' }}>
        <ConsultaModal
          icon="plus-circle"
          buttonFill
          buttonSize="25px"
          emitter="paciente"
          pacienteId={pacienteId}
        />
      </Col>
    </Row>
  );

  const columns: any[] = [
    {
      title: 'Data/Hora',
      dataIndex: 'data',
      key: 'data',
      render: (v: Date): string => moment(v).format('DD/MM/YYYY HH:mm'),
      sorter: (a: any, b: any): number => {
        const dataA = moment(a.data);
        const dataB = moment(b.data);

        if (dataA.isBefore(dataB)) return -1;
        if (dataA.isSame(dataB)) return 0;
        return 1;
      },
      defaultSortOrder: 'ascend',
    },
    {
      title: 'Responsável',
      dataIndex: 'responsavel',
      key: 'responsavel',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (v: number) => [
        'Agendado',
        'Em Espera',
        'Em Atendimento',
        'Atendimento Concluído',
        'Não Compareceu',
      ][v - 1],
    },
    {
      title: 'Ações',
      dataIndex: 'action',
      key: 'action',
      align: 'center' as 'center',
      render: (v: number): JSX.Element => (
        <>
          <ConsultaModal id={v} emitter="paciente" />
          <ConsultaDeleteButton id={v} />
        </>
      ),
    },
  ];

  const dataSource = temConsultas ? (consultas as Consulta[]).map(
    (c) => {
      const consultaId = c.id;

      return {
        ...c,
        action: consultaId,
      };
    },
  ) : [];

  return (
    <>
      <Table
        bordered
        title={header}
        dataSource={dataSource}
        columns={columns}
        pagination={{
          simple: true,
        }}
        style={{
          backgroundColor: '#fff',
        }}
        rowKey="id"
      />
    </>
  );
}
