import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, message } from 'antd';

import { Store } from '../store/store';

import { PacienteStore, persitido } from '../store/paciente';

export default function PacienteSaveButton(): JSX.Element {
  const [loading, setLoading] = useState(false);
  const [faltaDados, setFaltaDados] = useState(true);
  const dispatch = useDispatch();
  const pacienteStore: PacienteStore = useSelector<Store, PacienteStore>(
    (store) => store.paciente,
  );

  const { diferenteDoDb, infosPessoais } = pacienteStore;

  const nome = infosPessoais?.getDataValue('nome');

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
      try {
        await infosPessoais.saveAll(endereco, contato);
        dispatch(persitido());
        message.success('Salvo!', 1);
      } catch (error) {
        console.error(error);
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
