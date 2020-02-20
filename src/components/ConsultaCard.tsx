import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import moment, { Moment } from 'moment';

import { blue } from '@ant-design/colors';

import { methods, hooks } from '../services/graphql.service';
import ConsultaCardTitle from './ConsultaCardTitle';
import ConsultaCardDesc from './ConsultaCardDesc';

type propTypes = {
  id: number;
  style?: React.CSSProperties;
}

const { Meta } = Card;

function useComponent(props: propTypes) {
  const { id } = props;

  const [pacienteNome, setPacienteNome] = useState('');
  const [pacienteId, setPacienteId] = useState(-1);
  const [responsavel, setResponsavel] = useState('');
  const [dataHora, setDataHora] = useState<Moment | null>(moment());
  const [status, setStatus] = useState(0);
  const [telefone, setTelefone] = useState('');
  const { loading, data } = hooks.useConsultaPaciente(id);

  useEffect(() => {
    if (data && !loading) {
      const { consulta, paciente } = data.consultaPaciente;

      setPacienteNome(methods.paciente.getIniciais(paciente) || '');
      if (paciente.id) setPacienteId(paciente.id);
      if (paciente.contato?.telefone1) setTelefone(paciente.contato?.telefone1);
      if (consulta.responsavel) setResponsavel(consulta.responsavel);
      setDataHora(consulta.data ? moment(consulta.data) : null);
      if (consulta.status) setStatus(consulta.status);
    }
  }, [loading]);

  return {
    state: {
      pacienteNome,
      pacienteId,
      responsavel,
      dataHora,
      status,
      telefone,
      loading,
    },
  };
}

export default function ConsultaCard(props: propTypes): JSX.Element {
  const { id, style } = props;
  const { state } = useComponent(props);

  const {
    pacienteNome,
    pacienteId,
    responsavel,
    dataHora,
    status,
    telefone,
    loading,
  } = state;

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
            <ConsultaCardTitle
              consultaId={id}
              pacienteId={pacienteId}
              pacienteNome={pacienteNome}
              status={status}
              dataHora={dataHora}
            />
            <ConsultaCardDesc
              responsavel={responsavel}
              telefone={telefone}
              dataHora={dataHora}
            />
          </>
        )}
      />
    </Card>
  );
}
