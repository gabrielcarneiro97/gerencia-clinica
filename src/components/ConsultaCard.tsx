import React, { useState, useEffect } from 'react';
import { Card, Tag } from 'antd';
import moment, { Moment } from 'moment';

import ConsultaModal from './ConsultaModal';

import { consultaDb, pacienteDb, pacienteMethods } from '../services/db.service';

type propTypes = {
  id: number;
  style?: React.CSSProperties;
}

export default function ConsultaCard(props: propTypes): JSX.Element {
  const { id, style } = props;

  const [pacienteNome, setPacienteNome] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [dataHora, setDataHora] = useState<Moment | null>(moment());
  const [status, setStatus] = useState<number>(0);
  const [telefone, setTelefone] = useState('');

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
    getData();
  }, []);

  return (
    <Card
      title={pacienteNome}
      style={{ ...style, fontSize: 'smaller' }}
      extra={(
        <ConsultaModal
          id={id}
          saveEnd={getData}
        />
      )}
      size="small"
    >
      <p>
        Horário:
        &nbsp;
        {dataHora ? dataHora.format('HH:mm') : ''}
        &nbsp;
        &nbsp;
        {
          dataHora && dataHora.isBefore(moment().add(-5, 'm')) && status === 1
          && <Tag color="red" style={{ fontSize: 'x-small' }}>ATRASADO</Tag>
        }
      </p>
      <p>
        Responsável:
        &nbsp;
        {responsavel}
      </p>
      <p>
        Contato:
        &nbsp;
        {telefone}
      </p>
    </Card>
  );
}
