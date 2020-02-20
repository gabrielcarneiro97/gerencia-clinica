import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, message } from 'antd';

import { Store } from '../store/store';

import {
  PacienteStore, persitido, carregarPaciente,
} from '../store/paciente';
import { hooks } from '../services/graphql.service';

function useSaveAll() {
  const [savePaciente] = hooks.useSavePaciente();
  const [saveEndereco] = hooks.useSaveEndereco();
  const [saveContato] = hooks.useSaveContato();

  const saveAll = async (paciente: any) => {
    let enderecoId: number | null = null;
    let contatoId: number | null = null;

    const { endereco, contato } = paciente;

    if (endereco) {
      const enderecoRes = await saveEndereco({ variables: { endereco } });
      enderecoId = enderecoRes?.data?.saveEndereco.id ?? null;
    }

    if (contato) {
      const contatoRes = await saveContato({ variables: { contato } });
      contatoId = contatoRes?.data?.saveContato.id ?? null;
    }

    const pacienteNew = {
      ...paciente,
      enderecoId: paciente.enderecoId || enderecoId,
      contatoId: paciente.contatoId || contatoId,
    };

    const res = await savePaciente({ variables: { paciente: pacienteNew } });

    return res?.data?.savePaciente.id ?? -99;
  };

  return saveAll;
}

function useGetPaciente() {
  const dispatch = useDispatch();
  const [getPaciente, { data, loading }] = hooks.usePacienteLazy();

  useEffect(() => {
    if (data && !loading) {
      const { paciente } = data;
      dispatch(carregarPaciente(paciente));
      dispatch(persitido());
      message.success('Salvo!', 1);
    }
  }, [data, loading]);

  return getPaciente;
}

function useValidate() {
  const pacienteStore: PacienteStore = useSelector<Store, PacienteStore>(
    (store) => store.paciente,
  );
  const [faltaDados, setFaltaDados] = useState(true);

  const { paciente } = pacienteStore;

  const { nome, grupo1Id, grupo2Id } = paciente || { nome: '' };

  useEffect(() => {
    if (!nome
        || grupo1Id === null
        || grupo2Id === null
        || grupo1Id === undefined
        || grupo2Id === undefined
    ) {
      setFaltaDados(true);
      return;
    }

    setFaltaDados(false);
  }, [nome, grupo1Id, grupo2Id]);

  return !faltaDados;
}

function useComponent() {
  const pacienteStore: PacienteStore = useSelector<Store, PacienteStore>(
    (store) => store.paciente,
  );

  const [loading, setLoading] = useState(false);

  const saveAll = useSaveAll();
  const getPaciente = useGetPaciente();
  const allOk = useValidate();

  const { paciente, diferenteDoDb } = pacienteStore;


  const handleClick = async (): Promise<void> => {
    setLoading(true);
    if (paciente) {
      const pacienteId = await saveAll(paciente);
      if (pacienteId !== -1) {
        getPaciente({ variables: { pacienteId } });
      } else {
        message.error('CPF já cadastrado!', 1);
      }
    }
    setLoading(false);
  };

  return {
    state: {
      diferenteDoDb,
      loading,
      allOk,
    },
    methods: {
      handleClick,
    },
  };
}


export default function PacienteSaveButton(): JSX.Element {
  const { state, methods } = useComponent();

  const { diferenteDoDb, loading, allOk } = state;
  const { handleClick } = methods;

  return (
    <Button
      type="primary"
      onClick={handleClick}
      disabled={!diferenteDoDb || loading || !allOk}
      loading={loading}
    >
      Salvar
    </Button>
  );
}
