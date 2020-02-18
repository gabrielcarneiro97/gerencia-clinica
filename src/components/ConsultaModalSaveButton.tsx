import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, message } from 'antd';

import { Store } from '../store/store';
import { persitido } from '../store/consulta';
import { carregarConsultas } from '../store/paciente';
import { graphql, methods } from '../services/graphql.service';

import { acharERemoverBoardElement, adicionarBoardElement } from '../store/agenda';

type propTypes = {
  onEnd?: Function;
  emitter?: string;
}

export default function ConsultaModalSaveButton(props: propTypes): JSX.Element {
  const dispatch = useDispatch();
  const {
    consulta: consultaStore,
    paciente: pacienteStore,
  } = useSelector<Store, Store>((state) => state);

  const { diferenteDoDb } = consultaStore;

  const { onEnd, emitter } = props;

  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (diferenteDoDb) setDisabled(false);
  }, [diferenteDoDb]);

  const atualizaOnPaciente = async (): Promise<void> => {
    const { paciente } = pacienteStore;
    const { id: pacienteId } = paciente;

    if (!pacienteId) return;

    const consultas = await methods.paciente.getConsultas(pacienteId);

    dispatch(carregarConsultas(consultas));
  };

  const atualizaOnAgenda = async (newId?: number): Promise<void> => {
    const { consulta } = consultaStore;

    if (!consulta) return;

    const { id, status } = consulta;

    if (newId && status) {
      dispatch(adicionarBoardElement(status - 1, -1, newId));
    }

    if (!id || (!status && status !== 0)) return;

    dispatch(acharERemoverBoardElement(id));

    dispatch(adicionarBoardElement(status - 1, -1, id));
  };

  const handleClick = async (): Promise<void> => {
    setLoading(true);
    const { procedimentosRemovidos, consulta } = consultaStore;
    const { procedimentos } = consulta;

    if (consulta) {
      const id = await graphql.consulta.save(consulta);

      try {
        await Promise.all(procedimentos.map(async (p): Promise<any> => {
          if (!p.consultaId) p.consultaId = id; // eslint-disable-line no-param-reassign
          if (p.descricao) return graphql.consultaProcedimento.save(p);
          return false;
        }));
        await Promise.all(procedimentosRemovidos.map(
          async (p) => {
            if (!p.consultaId) p.consultaId = id; // eslint-disable-line no-param-reassign
            graphql.consultaProcedimento.delById(p.id);
          },
        ));

        if (emitter === 'paciente') await atualizaOnPaciente();
        if (emitter === 'agenda') {
          if (!consulta.id) await atualizaOnAgenda(id);
          else await atualizaOnAgenda();
        }

        dispatch(persitido());

        message.success('Consulta Atualizada com Sucesso!', 1);
      } catch (err) {
        console.error(err);
        message.error('Erro ao Salvar a Consulta!', 1);
      }
      setLoading(false);

      if (onEnd) onEnd(id);
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
