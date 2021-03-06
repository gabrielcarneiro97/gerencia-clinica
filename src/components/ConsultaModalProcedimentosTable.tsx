import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Table,
  Row,
  Col,
  Button,
  Icon,
  Input,
} from 'antd';

import { Store } from '../store/store';
import {
  modificarProcedimento, mudou, removerProcedimento, adicionarProcedimento, ConsultaStore,
} from '../store/consulta';

import { ConsultaProcedimento } from '../types';


export default function ConsultaModalProcedimentosTable(): JSX.Element {
  const { consulta } = useSelector<Store, ConsultaStore>(
    (store: Store) => store.consulta,
  );
  const dispatch = useDispatch();

  const { procedimentos } = consulta;

  const consultaId = (consulta && consulta.id);

  const header = () => (
    <Row gutter={8}>
      <Col span={12}>
        <div style={{ fontWeight: 'bold', fontSize: 'medium' }}>
          Procedimentos
        </div>
      </Col>
      <Col span={12} style={{ textAlign: 'end' }}>
        <Button
          type="link"
          shape="circle"
          style={{ fontSize: '25px' }}
          onClick={() => {
            const procedimento: ConsultaProcedimento = {
              consultaId,
              descricao: '',
            };
            dispatch(adicionarProcedimento(procedimento));
            dispatch(mudou());
          }}
        >
          <Icon type="plus-circle" theme="filled" />
        </Button>
      </Col>
    </Row>
  );

  const dataSource = procedimentos?.map((p, i) => ({ ...p, key: i })) ?? [];

  const columns: any[] = [
    {
      title: 'Descrição',
      dataIndex: 'descricao',
      key: 'descricao',
      render: (v: any, d: any): JSX.Element | string => {
        const i = d.key;
        if (procedimentos) {
          return (
            <Input
              value={procedimentos[i].descricao || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                const procedimento = procedimentos[i];
                procedimento.descricao = e.target.value;
                dispatch(modificarProcedimento(procedimento, i));
                dispatch(mudou());
              }}
            />
          );
        }
        return '';
      },
    },
    {
      title: '',
      width: 40,
      render: (v: any, d: any, i: number): JSX.Element => (
        <Button
          type="link"
          shape="circle"
          style={{ fontSize: '20px' }}
          onClick={() => {
            dispatch(removerProcedimento(i));
            dispatch(mudou());
          }}
        >
          <Icon type="delete" />
        </Button>
      ),
    },
  ];

  return (
    <Table
      bordered
      pagination={{
        simple: true,
      }}
      title={header}
      columns={columns}
      dataSource={dataSource}
    />
  );
}
