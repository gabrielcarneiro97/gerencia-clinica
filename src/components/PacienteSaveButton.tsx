import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, message } from 'antd';

import { Store } from '../store/store';

import {
  PacienteStore, persitido, carregarPaciente,
} from '../store/paciente';
import { graphql } from '../services/graphql.service';


export default function PacienteSaveButton(): JSX.Element {
  const [loading, setLoading] = useState(false);
  const [faltaDados, setFaltaDados] = useState(true);
  const dispatch = useDispatch();
  const pacienteStore: PacienteStore = useSelector<Store, PacienteStore>(
    (store) => store.paciente,
  );

  const { paciente, diferenteDoDb } = pacienteStore;

  const {
    endereco,
    contato,
  } = paciente;

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

  const handleClick = async (): Promise<void> => {
    setLoading(true);
    if (paciente) {
      const pId = await graphql.paciente.saveAll(paciente, endereco, contato);
      if (pId !== -1) {
        const novoPaciente = await graphql.paciente.getById(pId);

        dispatch(carregarPaciente(novoPaciente));
        dispatch(persitido());
        message.success('Salvo!', 1);
      } else {
        message.error('CPF já cadastrado!', 1);
      }
    }
    setLoading(false);
  };

  return (
    <Button
      type="primary"
      onClick={handleClick}
      disabled={!diferenteDoDb || loading || faltaDados}
      loading={loading}
    >
      Salvar
    </Button>
  );
}
