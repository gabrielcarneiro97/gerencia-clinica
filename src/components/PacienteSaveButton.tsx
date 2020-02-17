import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, message } from 'antd';

import { Store } from '../store/store';

import {
  PacienteStore, persitido, carregarInfosPessoais, carregarEndereco, carregarContato,
} from '../store/paciente';
import { graphql } from '../services/graphql.service';


export default function PacienteSaveButton(): JSX.Element {
  const [loading, setLoading] = useState(false);
  const [faltaDados, setFaltaDados] = useState(true);
  const dispatch = useDispatch();
  const pacienteStore: PacienteStore = useSelector<Store, PacienteStore>(
    (store) => store.paciente,
  );

  const { diferenteDoDb, infosPessoais } = pacienteStore;

  const { nome, grupo1Id, grupo2Id } = infosPessoais || { nome: '' };

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
    const { endereco, contato } = pacienteStore;
    setLoading(true);
    if (infosPessoais) {
      const pId = await graphql.paciente.saveAll(infosPessoais, endereco, contato);
      if (pId !== -1) {
        const novoPaciente = await graphql.paciente.getById(pId);

        dispatch(carregarInfosPessoais(novoPaciente));
        dispatch(carregarEndereco({ ...endereco, id: novoPaciente.enderecoId || undefined }));
        dispatch(carregarContato({ ...contato, id: novoPaciente.contatoId || undefined }));
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
