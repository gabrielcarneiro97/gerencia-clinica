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

import { pacienteMethods, consultaDb } from '../services/db.service';

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

    const consultas = await pacienteMethods.getConsultas(infosPessoais);

    dispatch(carregarConsultas(consultas));
  };

  const confirm = async (): Promise<void> => {
    await consultaDb.delById(id);
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
