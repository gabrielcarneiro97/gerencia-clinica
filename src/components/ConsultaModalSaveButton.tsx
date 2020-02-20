import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, message } from 'antd';

import { Store } from '../store/store';
import { persitido } from '../store/consulta';
import { carregarConsultas } from '../store/paciente';
import { hooks } from '../services/graphql.service';

import { acharERemoverBoardElement, adicionarBoardElement } from '../store/agenda';

type propTypes = {
  onEnd?: Function;
  emitter?: string;
}

function useGetConsultas() {
  const dispatch = useDispatch();

  const [
    getConsultas,
    { data: getConsultasData, loading: getConsultasLoading },
  ] = hooks.useConsultasByPacienteIdLazy();


  useEffect(() => {
    if (getConsultasData && !getConsultasLoading) {
      const { consultas } = getConsultasData;
      dispatch(carregarConsultas(consultas));
    }
  }, [getConsultasData, getConsultasLoading]);

  return getConsultas;
}

function useComponent(props: propTypes) {
  const dispatch = useDispatch();
  const {
    consulta: consultaStore,
    paciente: pacienteStore,
  } = useSelector<Store, Store>((state) => state);

  const { diferenteDoDb } = consultaStore;

  const { onEnd, emitter } = props;

  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const [saveConsulta] = hooks.useSaveConsulta();
  const [saveProcedimento] = hooks.useSaveProcedimento();
  const [deleteProcedimento] = hooks.useDeleteProcedimento();

  const getConsultas = useGetConsultas();

  useEffect(() => {
    if (diferenteDoDb) setDisabled(false);
  }, [diferenteDoDb]);

  const atualizaOnPaciente = async (): Promise<void> => {
    const { paciente } = pacienteStore;
    const { id: pacienteId } = paciente;

    if (!pacienteId) return;

    getConsultas({ variables: { pacienteId } });
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
      const { data } = await saveConsulta({ variables: { consulta } });

      if (data) {
        const { id } = data.saveConsulta;

        if (procedimentos) {
          await Promise.all(procedimentos.map(async (procedimento): Promise<any> => {
            if (!procedimento.consultaId) {
              procedimento.consultaId = id; // eslint-disable-line no-param-reassign
            }
            if (procedimento.descricao) return saveProcedimento({ variables: { procedimento } });
            return false;
          }));
        }

        try {
          await Promise.all(procedimentosRemovidos.map(
            async (p) => deleteProcedimento({ variables: { id: p.id } }),
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
    }
  };

  return {
    state: {
      disabled,
      loading,
    },
    methods: {
      handleClick,
    },
  };
}

export default function ConsultaModalSaveButton(props: propTypes): JSX.Element {
  const { state, methods } = useComponent(props);
  const { disabled, loading } = state;
  const { handleClick } = methods;

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
