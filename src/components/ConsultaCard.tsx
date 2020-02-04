import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Badge,
} from 'antd';
import moment, { Moment } from 'moment';

import { blue } from '@ant-design/colors';
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
    <p style={{ ...pStyle }}>
      <span style={{
        textAlign: 'start',
        width: '70%',
        display: 'inline-block',
        fontWeight: 500,
      }}
      >
        {pacienteNome}
        &nbsp;
        {
          ((dataHora && dataHora.isBefore(moment().add(-5, 'm'))) && status === 1)
          && <Badge status="error" />
        }
      </span>
      <span style={{ textAlign: 'end', width: '30%', display: 'inline-block' }}>
        <ConsultaModal
          id={id}
          saveEnd={getData}
          emitter="agenda"
          buttonSize={13}
        />
      </span>
    </p>
  );

  const description = (
    <>
      <p style={pStyle}>
        {dataHora ? dataHora.format('HH:mm') : ''}
        &nbsp;
        -
        &nbsp;
        {responsavel}
      </p>
      <p style={pStyle}>
        {telefone}
      </p>
    </>
  );

  return (
    <Card
      type="inner"
      loading={loading}
      style={{
        ...style,
        fontSize: 'small',
        marginBottom: '12px',
        border: `1px solid ${blue[1]}`,
        borderRadius: 5,
      }}
      hoverable
      bodyStyle={{ padding: '8px' }}
      size="small"
    >
      <Meta
        description={(
          <>
            {title}
            {description}
          </>
        )}
      />
    </Card>
  );
}
