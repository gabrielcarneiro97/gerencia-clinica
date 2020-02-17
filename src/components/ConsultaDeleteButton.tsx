import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Popconfirm,
  Button,
  Icon,
  message,
} from 'antd';

import { Store } from '../store/store';
import { PacienteStore, carregarConsultas } from '../store/paciente';

import { graphql, methods } from '../services/graphql.service';

type propTypes = {
  id: number;
}

export default function ConsultaDeleteButton(props: propTypes): JSX.Element {
  const { id } = props;

  const paciente = useSelector<Store, PacienteStore>((store) => store.paciente);
  const dispatch = useDispatch();

  const atualizaOnPaciente = async (): Promise<void> => {
    const { infosPessoais } = paciente;

    if (!infosPessoais) return;

    const consultas = await methods.paciente.getConsultas(infosPessoais);

    dispatch(carregarConsultas(consultas));
  };

  const confirm = async (): Promise<void> => {
    await graphql.consulta.delById(id);
    atualizaOnPaciente();
    message.success('Consulta Excluída!', 1);
  };

  return (
    <Popconfirm
      title="Tem certeza que quer excluir essa consulta?"
      okText="Sim"
      cancelText="Não"
      onConfirm={confirm}
    >
      <Button
        type="link"
        shape="circle"
        style={{ fontSize: '20px' }}
      >
        <Icon type="delete" />
      </Button>
    </Popconfirm>
  );
}
