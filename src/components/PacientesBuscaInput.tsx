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

import { hooks } from '../services/graphql.service';
import { Paciente } from '../types';

function usePacienteLazy(setPaciente: Function) {
  const [executeSelecionado, selecionadoHook] = hooks.usePacienteLazy();

  useEffect(() => {
    const { loading, data, called } = selecionadoHook;
    if (!loading && called && data) setPaciente(data.paciente);
  }, [selecionadoHook.loading, selecionadoHook.called, selecionadoHook.data]);

  return executeSelecionado;
}

function usePacientesByNameLazy(setPacientesNomes: Function) {
  const [executePacientes, pacientesHook] = hooks.usePacientesByNameLazy();

  useEffect(() => {
    const { loading, data, called } = pacientesHook;
    if (!loading && called && data) {
      const { pacientes } = data;
      setPacientesNomes(pacientes.map(
        (p) => ({ text: p.nome, value: p.id }),
      ));
    }
  }, [pacientesHook.loading, pacientesHook.called, pacientesHook.data]);

  return executePacientes;
}

function useComponent() {
  const dispatch = useDispatch();

  const pacienteStore = useSelector<Store, PacienteStore>(
    (store) => store.paciente,
  );

  const [searchString, setSearchString] = useState();
  const [pacientesNomes, setPacientesNomes]: [DataSourceItemType[], Function] = useState([]);

  const { paciente } = pacienteStore;

  const setPaciente = (p: Paciente) => dispatch(carregarPaciente(p));

  const executeSelecionado = usePacienteLazy(setPaciente);
  const executePacientes = usePacientesByNameLazy(setPacientesNomes);

  useEffect(() => {
    if (paciente.id === null) setSearchString('');
  }, [paciente]);


  const handleChange = async (value: SelectValue): Promise<void> => {
    setSearchString(value);

    if (value !== '') {
      executePacientes({ variables: { nome: value as string } });
    } else {
      setPacientesNomes([]);
    }

    if (paciente.nome) dispatch(limparPaciente());
  };

  const handleSelect = async (pacienteId: SelectValue): Promise<void> => {
    executeSelecionado({ variables: { pacienteId: parseInt(pacienteId.toString(), 10) } });
  };

  return {
    state: {
      pacientesNomes,
      searchString,
    },
    methods: {
      handleChange,
      handleSelect,
    },
  };
}

export default function PacienteBuscaInput(): JSX.Element {
  const { state, methods } = useComponent();

  const { pacientesNomes, searchString } = state;
  const { handleChange, handleSelect } = methods;

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
