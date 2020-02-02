import React, { useState, useEffect } from 'react';
import {
  Card,
  Tag,
  Row,
  Col,
  Badge,
} from 'antd';
import moment, { Moment } from 'moment';

import ConsultaModal from './ConsultaModal';

import { consultaDb, pacienteDb, pacienteMethods } from '../services/db.service';

type propTypes = {
  id: number;
  style?: React.CSSProperties;
}

const { Meta } = Card;

export default function ConsultaCard(props: propTypes): JSX.Element {
  const { id, style } = props;

  const [pacienteNome, setPacienteNome] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [dataHora, setDataHora] = useState<Moment | null>(moment());
  const [status, setStatus] = useState(0);
  const [telefone, setTelefone] = useState('');
  const [loading, setLoading] = useState(true);

  const getData = async (): Promise<void> => {
    const consulta = await consultaDb.getById(id);

    if (consulta) {
      const { pacienteId, data } = consulta;

      const resp = consulta.responsavel;
      const s = consulta.status;

      setResponsavel(resp || '');
      setDataHora(data ? moment(data) : null);
      setStatus(s || 0);

      const paciente = await pacienteDb.getById(pacienteId);

      if (paciente) {
        setPacienteNome(pacienteMethods.getIniciais(paciente));

        const contato = await pacienteMethods.getContato(paciente);

        if (contato) {
          const { telefone1 } = contato;
          setTelefone(telefone1 || '');
        }
      }
    }
  };

  useEffect(() => {
    getData().then(() => setLoading(false));
  }, []);

  const pStyle: React.CSSProperties = { marginBottom: '3px' };

  const title = (
    <Row gutter={8} type="flex" justify="space-around" align="middle">
      <Col span={19}>
        {pacienteNome}
        &nbsp;
        {
          ((dataHora && dataHora.isBefore(moment().add(-5, 'm'))) && status === 1)
          && <Badge status="error" />
        }
      </Col>
      <Col span={5}>
        <ConsultaModal
          id={id}
          saveEnd={getData}
        />
      </Col>
    </Row>
  );

  const description = (
    <>
      <p style={pStyle}>
        <strong>Horário:</strong>
        &nbsp;
        {dataHora ? dataHora.format('HH:mm') : ''}
      </p>
      <p style={pStyle}>
        <strong>Responsável:</strong>
        &nbsp;
        {responsavel}
      </p>
      <p style={pStyle}>
        <strong>Contato:</strong>
        &nbsp;
        {telefone}
      </p>
    </>
  );

  return (
    <Card
      type="inner"
      loading={loading}
      style={{ ...style, fontSize: 'small' }}
      // bodyStyle={{ padding: '8px' }}
      size="small"
    >
      <Meta
        title={title}
        description={description}
      />
    </Card>
  );
}
