import React, { useState, useEffect } from 'react';
import {
  Card,
  Badge,
} from 'antd';
import moment, { Moment } from 'moment';

import { blue } from '@ant-design/colors';
import ConsultaModal from './ConsultaModal';

import { graphql, methods } from '../services/graphql.service';

type propTypes = {
  id: number;
  style?: React.CSSProperties;
}

const { Meta } = Card;

export default function ConsultaCard(props: propTypes): JSX.Element {
  const { id, style } = props;

  const [isMounted, setIsMounted] = useState<boolean>(true);
  const [pacienteNome, setPacienteNome] = useState('');
  const [pacienteId, setPacienteId] = useState(-1);
  const [responsavel, setResponsavel] = useState('');
  const [dataHora, setDataHora] = useState<Moment | null>(moment());
  const [status, setStatus] = useState(0);
  const [telefone, setTelefone] = useState('');
  const [loading, setLoading] = useState(true);

  const getData = async (): Promise<void> => {
    if (!isMounted) return;

    const consulta = await graphql.consulta.getById(id);

    if (consulta) {
      const { pacienteId: pId, data } = consulta;

      const resp = consulta.responsavel;
      const s = consulta.status;

      setResponsavel(resp || '');
      setDataHora(data ? moment(data) : null);
      setStatus(s || 0);

      if (pId) {
        const paciente = await graphql.paciente.getById(pId);

        if (paciente) {
          setPacienteNome(methods.paciente.getIniciais(paciente));
          setPacienteId(pId);

          const { contato } = paciente;

          if (contato) {
            const { telefone1 } = contato;
            setTelefone(telefone1 || '');
          }
        }
      }
    }
  };

  useEffect(() => {
    getData().then(() => {
      if (isMounted) setLoading(false);
    });

    return (): void => setIsMounted(false);
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
          pacienteId={pacienteId}
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
        &nbsp;
      </p>
    </>
  );

  return (
    <Card
      type="inner"
      loading={loading}
      style={{
        fontSize: 'small',
        marginBottom: '12px',
        border: `1px solid ${blue[1]}`,
        borderRadius: 5,
        ...style,
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
