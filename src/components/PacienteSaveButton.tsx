import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, message } from 'antd';

import { Store } from '../store/store';

import { PacienteStore, persitido } from '../store/paciente';
import { pacienteDb } from '../services/db.service';

export default function PacienteSaveButton(): JSX.Element {
  const [loading, setLoading] = useState(false);
  const [faltaDados, setFaltaDados] = useState(true);
  const dispatch = useDispatch();
  const pacienteStore: PacienteStore = useSelector<Store, PacienteStore>(
    (store) => store.paciente,
  );

  const { diferenteDoDb, infosPessoais } = pacienteStore;

  const { nome } = infosPessoais || { nome: '' };

  useEffect(() => {
    if (!nome) {
      setFaltaDados(true);
      return;
    }

    setFaltaDados(false);
  }, [nome]);

  const handleClick = async (): Promise<void> => {
    const { endereco, contato } = pacienteStore;
    setLoading(true);
    if (infosPessoais) {
      const res = await pacienteDb.saveAll(infosPessoais, endereco, contato);
      if (res) {
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
