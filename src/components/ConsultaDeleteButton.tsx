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

import { excluirConsulta, models } from '../db/db.service';

const { Consulta } = models;

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

    const pacienteId = infosPessoais.getDataValue('id');

    const consultas = await Consulta.findAll({
      where: {
        pacienteId,
      },
    });

    dispatch(carregarConsultas(consultas));
  };

  const confirm = async (): Promise<void> => {
    await excluirConsulta(id);
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
