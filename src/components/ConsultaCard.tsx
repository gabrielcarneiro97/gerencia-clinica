import React, { useState, useEffect } from 'react';
import { Card, Tag } from 'antd';
import moment, { Moment } from 'moment';

import ConsultaModal from './ConsultaModal';

type propTypes = {
  id: number;
}

export default function ConsultaCard(props: propTypes): JSX.Element {
  const { id } = props;

  const [pacienteNome, setPacienteNome] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [dataHora, setDataHora] = useState<Moment | null>(moment());
  const [status, setStatus] = useState<number>(0);
  const [telefone, setTelefone] = useState('');

  const getData = async (): Promise<void> => {
    const consulta = await Consulta.findByPk(id);

    if (consulta) {
      const pacienteId = consulta.getDataValue('pacienteId');
      const data = consulta.getDataValue('data');
      const resp = consulta.getDataValue('responsavel');
      const s = consulta.getDataValue('status');

      setResponsavel(resp || '');
      setDataHora(data ? moment(data) : null);
      setStatus(s || 0);

      const paciente = await Paciente.findByPk(pacienteId);

      if (paciente) {
        setPacienteNome(paciente.getIniciais());

        const contato = await paciente.getContato();

        const telefone1 = contato.getDataValue('telefone1');

        setTelefone(telefone1 || '');
      }
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Card
      title={pacienteNome}
      extra={(
        <ConsultaModal
          id={id}
          saveEnd={getData}
        />
      )}
      style={{
        fontSize: 'smaller',
      }}
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
