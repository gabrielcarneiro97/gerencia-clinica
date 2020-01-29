import React, { useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  Table, Row, Col,
} from 'antd';

import moment from 'moment';

import { models } from '../db/db.service';
import ConsultaClass from '../db/models/Consulta';

import { Store } from '../store/store';

import { PacienteStore, carregarConsultas } from '../store/paciente';
import ConsultaModal from './ConsultaModal';
import ConsultaDeleteButton from './ConsultaDeleteButton';

const { Consulta } = models;

export default function PacienteConsultasTable(): JSX.Element {
  const paciente = useSelector<Store, PacienteStore>((store) => store.paciente);
  const dispatch = useDispatch();

  const { consultas, infosPessoais } = paciente;

  const pacienteId = infosPessoais?.getDataValue('id') || 0;
  const temConsultas = consultas.length > 0;

  useEffect(() => {
    if (consultas.length === 0) {
      Consulta.findAll({
        where: {
          pacienteId,
        },
      }).then((consultasDb) => dispatch(carregarConsultas(consultasDb)));
    }
  }, [pacienteId]);

  const header = (): JSX.Element => (
    <Row gutter={8}>
      <Col span={12}>
        <div style={{ fontWeight: 'bold', fontSize: 'medium' }}>
          Consultas
        </div>
      </Col>
      <Col span={12} style={{ textAlign: 'end' }}>
        <ConsultaModal
          buttonConfig={{
            icon: 'plus-circle',
            filled: true,
            size: '25px',
          }}
          emitter="paciente"
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
      render: (v: number) => {
        switch (v) {
          case 1:
            return 'Agendado';
          case 2:
            return 'Em Espera';
          case 3:
            return 'Em Atendimento';
          case 4:
            return 'Atendimento Concluído';
          case 5:
            return 'Não Compareceu';
          default:
            return '';
        }
      },
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

  const dataSource = temConsultas ? (consultas as ConsultaClass[]).map(
    (c) => {
      const consultaId = c.getDataValue('id');

      return {
        ...c.toJSON(),
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
