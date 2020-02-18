import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AutoComplete } from 'antd';
import { SelectValue } from 'antd/lib/select';
import { DataSourceItemType } from 'antd/lib/auto-complete';

import { Store } from '../store/store';

import {
  carregarPaciente,
  limparPaciente,
  PacienteStore,
} from '../store/paciente';

import { graphql } from '../services/graphql.service';

export default function PacienteBuscaInput(): JSX.Element {
  const dispatch = useDispatch();

  const pacienteStore = useSelector<Store, PacienteStore>(
    (store) => store.paciente,
  );

  const { paciente } = pacienteStore;

  const [searchString, setSearchString] = useState();
  const [pacientesNomes, setPacientesNomes]: [DataSourceItemType[], Function] = useState([]);

  useEffect(() => {
    if (paciente.id === null) setSearchString('');
  }, [paciente]);

  const handleChange = async (value: SelectValue): Promise<void> => {
    setSearchString(value);

    if (value !== '') {
      const pacientes = await graphql.paciente.findByName(value as string);
      setPacientesNomes(pacientes.map(
        (p) => ({ text: p.nome, value: p.id }),
      ));
    } else {
      setPacientesNomes([]);
    }

    if (paciente.nome) dispatch(limparPaciente());
  };

  const handleSelect = async (pacienteId: SelectValue): Promise<void> => {
    const pacienteSelecionado = await graphql.paciente.getById(parseInt(pacienteId.toString(), 10));

    if (pacienteSelecionado) {
      dispatch(carregarPaciente(pacienteSelecionado));
    }
  };

  return (
    <AutoComplete
      dataSource={pacientesNomes}
      value={searchString}
      onChange={handleChange}
      placeholder="Digite o Nome do Paciente"
      onSelect={handleSelect}
      style={{ width: '100%' }}
    />
  );
}
