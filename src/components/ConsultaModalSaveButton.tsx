import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, message } from 'antd';

import { Store } from '../store/store';
import { persitido } from '../store/consulta';
import { carregarConsultas } from '../store/paciente';
import { pacienteMethods, consultaProcedimentoDb, consultaDb } from '../services/db.service';

type propTypes = {
  onEnd?: Function;
  emitter?: string;
}

export default function ConsultaModalSaveButton(props: propTypes): JSX.Element {
  const dispatch = useDispatch();
  const { consulta, paciente } = useSelector<Store, Store>((state) => state);

  const { diferenteDoDb } = consulta;

  const { onEnd, emitter } = props;

  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (diferenteDoDb) setDisabled(false);
  }, [diferenteDoDb]);

  const atualizaOnPaciente = async (): Promise<void> => {
    const { infosPessoais } = paciente;

    if (!infosPessoais) return;

    const consultas = await pacienteMethods.getConsultas(infosPessoais);

    dispatch(carregarConsultas(consultas));
  };

  const handleClick = async (): Promise<void> => {
    setLoading(true);
    const { procedimentos, procedimentosRemovidos, infos } = consulta;

    if (infos) {
      const id = await consultaDb.save(infos);


      try {
        await Promise.all(procedimentos.map(async (p): Promise<any> => {
          if (!p.consultaId) p.consultaId = id; // eslint-disable-line no-param-reassign
          if (p.descricao) return consultaProcedimentoDb.save(p);
          return false;
        }));
        await Promise.all(procedimentosRemovidos.map(
          async (p) => {
            if (!p.consultaId) p.consultaId = id; // eslint-disable-line no-param-reassign
            consultaProcedimentoDb.destroy(p);
          },
        ));

        if (emitter === 'paciente') await atualizaOnPaciente();

        dispatch(persitido());

        message.success('Consulta Atualizada com Sucesso!', 1);
      } catch (err) {
        console.error(err);
        message.error('Erro ao Salvar a Consulta!', 1);
      }
      setLoading(false);

      if (onEnd) onEnd();
    }
  };

  return (
    <Button
      type="primary"
      disabled={disabled || loading}
      loading={loading}
      onClick={handleClick}
    >
      Salvar
    </Button>
  );
}
