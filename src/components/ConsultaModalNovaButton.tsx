import React from 'react';
import { useDispatch } from 'react-redux';
import { Button } from 'antd';
import { Consulta } from '../types';
import { limparConsulta, carregarConsulta } from '../store/consulta';

type propTypes = {
  pacienteId?: number | null;
}

export default function ConsultaModalNovaButton(props: propTypes): JSX.Element {
  const dispatch = useDispatch();

  const { pacienteId } = props;

  const novaConsulta = (): void => {
    if (pacienteId) {
      dispatch(limparConsulta());
      const consulta: Consulta = {
        pacienteId,
        status: 1,
        procedimentos: [],
      };
      dispatch(carregarConsulta(consulta));
    }
  };

  return (
    <Button
      onClick={novaConsulta}
      disabled={(!pacienteId && pacienteId !== 0) || pacienteId === -1}
    >
      Nova Consulta
    </Button>
  );
}
