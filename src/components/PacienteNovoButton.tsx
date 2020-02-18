import React from 'react';
import { useDispatch } from 'react-redux';

import { Button, Icon, Popover } from 'antd';

import {
  carregarPaciente,
  carregarEndereco,
  carregarContato,
  limparPaciente,
} from '../store/paciente';

import { Paciente, Endereco, Contato } from '../types';

export default function PacienteNovoButton(): JSX.Element {
  const dispatch = useDispatch();

  const handleClick = (): void => {
    const pacienteEmpty: Paciente = {
      id: null,
      consultas: [],
    };

    const endereco: Endereco = {};
    const contato: Contato = {};

    dispatch(limparPaciente());
    dispatch(carregarPaciente(pacienteEmpty));
    dispatch(carregarEndereco(endereco));
    dispatch(carregarContato(contato));
  };

  return (
    <div
      style={{ marginBottom: '3px' }}
    >
      <Popover
        content="Cadastrar Novo Paciente"
        placement="bottomRight"
      >
        <Button
          onClick={handleClick}
          type="link"
          shape="circle"
          style={{ fontSize: '25px' }}
        >
          <Icon type="plus-circle" theme="filled" />
        </Button>
      </Popover>
    </div>
  );
}
