import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  AutoComplete,
  Button,
  Col,
  Popover,
  Icon,
} from 'antd';
import { SelectValue } from 'antd/lib/select';
import { DataSourceItemType } from 'antd/lib/auto-complete';

import { Op } from 'sequelize';

import { Paciente, Endereco, Contato } from '../types';

import { Store } from '../store/store';

import {
  carregarInfosPessoais,
  carregarEndereco,
  carregarContato,
  limparPaciente,
} from '../store/paciente';
import { pacienteDb, pacienteMethods } from '../services/db.service';


export default function PacienteBuscaForm(): JSX.Element {
  const dispatch = useDispatch();

  const infosPessoais = useSelector<Store, Paciente | null>(
    (store) => store.paciente.infosPessoais,
  );

  const [searchString, setSearchString] = useState();
  const [pacientesBusca, setPacientesBusca]: [Paciente[], Function] = useState([]);
  const [pacientesNomes, setPacientesNomes]: [DataSourceItemType[], Function] = useState([]);

  useEffect(() => () => {
    dispatch(limparPaciente());
  }, []);

  const handleChange = async (value: SelectValue): Promise<void> => {
    setSearchString(value);

    if (value !== '') {
      const pacientes = await pacienteDb.findByName(value as string);
      console.log(pacientes);
      setPacientesBusca(pacientes);
      setPacientesNomes(pacientes.map(
        (p) => ({ text: p.nome, value: p.id }),
      ));
    } else {
      setPacientesBusca([]);
      setPacientesNomes([]);
    }

    if (infosPessoais) dispatch(limparPaciente());
  };

  const handleSelect = async (pacienteId: SelectValue): Promise<void> => {
    const pacienteSelecionado = pacientesBusca.find(
      (p) => p.id === parseInt(pacienteId as string, 10),
    );

    if (pacienteSelecionado) {
      const endereco = await pacienteMethods.getEndereco(pacienteSelecionado);
      console.log(endereco);
      const contato = await pacienteMethods.getContato(pacienteSelecionado);

      dispatch(carregarInfosPessoais(pacienteSelecionado));
      if (endereco) dispatch(carregarEndereco(endereco));
      if (contato) dispatch(carregarContato(contato));
    }
  };

  const handleNovo = (): void => {
    const paciente: Paciente = {};
    const endereco: Endereco = {};
    const contato: Contato = {};

    setSearchString('');
    dispatch(limparPaciente());
    dispatch(carregarInfosPessoais(paciente));
    dispatch(carregarEndereco(endereco));
    dispatch(carregarContato(contato));
  };

  return (
    <>
      <Col span={23}>
        <AutoComplete
          dataSource={pacientesNomes}
          value={searchString}
          onChange={handleChange}
          placeholder="Digite o Nome do Paciente"
          onSelect={handleSelect}
          style={{ width: '100%' }}
        />
      </Col>
      <Col span={1}>
        <div
          style={{ marginBottom: '3px' }}
        >
          <Popover
            content="Cadastrar Novo Paciente"
            placement="bottomRight"
          >
            <Button
              onClick={handleNovo}
              type="link"
              shape="circle"
              style={{ fontSize: '25px' }}
            >
              <Icon type="plus-circle" theme="filled" />
            </Button>
          </Popover>
        </div>
      </Col>
    </>
  );
}
