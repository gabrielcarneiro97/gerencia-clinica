import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Popconfirm,
  Button,
  Icon,
  message,
} from 'antd';

import { Store } from '../store/store';
import { PacienteStore, carregarConsultas } from '../store/paciente';

import { hooks } from '../services/graphql.service';

type propTypes = {
  id: number;
}

function useComponent(props: propTypes) {
  const { id } = props;

  const pacienteStore = useSelector<Store, PacienteStore>((store) => store.paciente);
  const dispatch = useDispatch();
  const [deleteConsulta] = hooks.useDeleteConsulta();
  const [getConsultas, { data, loading }] = hooks.useConsultasByPacienteIdLazy();

  useEffect(() => {
    if (data && !loading) {
      const { consultas } = data;
      dispatch(carregarConsultas(consultas));
    }
  }, [data, loading]);

  const atualizaOnPaciente = async (): Promise<void> => {
    const { paciente } = pacienteStore;
    const { id: pacienteId } = paciente;

    if (!pacienteId) return;

    getConsultas({ variables: { pacienteId } });
  };

  const confirm = async (): Promise<void> => {
    await deleteConsulta({ variables: { id } });
    atualizaOnPaciente();
    message.success('Consulta Excluída!', 1);
  };

  return {
    methods: {
      confirm,
    },
  };
}

export default function ConsultaDeleteButton(props: propTypes): JSX.Element {
  const component = useComponent(props);
  const { confirm } = component.methods;

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
