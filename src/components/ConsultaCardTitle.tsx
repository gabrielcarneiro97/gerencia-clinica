import React from 'react';
import {
  Badge,
} from 'antd';
import moment, { Moment } from 'moment';

import ConsultaModal from './ConsultaModal';

type propTypes = {
  pacienteNome: string;
  dataHora: moment.Moment | null;
  status: number;
  pacienteId: number;
  consultaId: number;
}

export default function ConsultaCardTitle(props: propTypes): JSX.Element {
  const {
    pacienteNome,
    dataHora,
    status,
    pacienteId,
    consultaId,
  } = props;

  const pStyle: React.CSSProperties = { marginBottom: '3px' };

  return (
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
          id={consultaId}
          pacienteId={pacienteId}
          emitter="agenda"
          buttonSize={13}
        />
      </span>
    </p>
  );
}
