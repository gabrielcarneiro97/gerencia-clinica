import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Table,
  Row,
  Col,
  Typography,
  Button,
  Icon,
  Input,
} from 'antd';

import { Store } from '../store/store';
import {
  modificarProcedimento, mudou, removerProcedimento, adicionarProcedimento, ConsultaStore,
} from '../store/consulta';

import { models } from '../db/db.service';

const { ConsultaProcedimento } = models;

const { Text } = Typography;

export default function ConsultaModalProcedimentosTable(): JSX.Element {
  const { procedimentos, infos } = useSelector<Store, ConsultaStore>(
    (store: Store) => store.consulta,
  );
  const dispatch = useDispatch();

  const consultaId = infos?.getDataValue('id');

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
            const procedimento = ConsultaProcedimento.build({
              consultaId,
            });
            dispatch(adicionarProcedimento(procedimento));
            dispatch(mudou());
          }}
        >
          <Icon type="plus-circle" theme="filled" />
        </Button>
      </Col>
    </Row>
  );

  const dataSource = procedimentos.map((p, i) => ({ ...p.toJSON(), key: i }));

  const columns: any[] = [
    {
      title: 'Descrição',
      dataIndex: 'descricao',
      key: 'descricao',
      render: (v: any, d: any): JSX.Element => {
        const i = d.key;
        return (
          <Input
            value={procedimentos[i].getDataValue('descricao') || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
              const procedimento = procedimentos[i];
              procedimento.setDataValue('descricao', e.target.value);
              dispatch(modificarProcedimento(procedimento, i));
              dispatch(mudou());
            }}
          />
        );
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
