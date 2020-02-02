import { Reducer } from 'redux';

import { Consulta } from '../types';

type Handlers = { [key: string]: (state?: AgendaStore, action?: Action) => AgendaStore };

export type AgendaStore = {
  consultas: Consulta[];
  agendadas: number[];
  salaDeEspera: number[];
  emAtendimento: number[];
  concluidas: number[];
  ausentes: number[];
};

type Action = {
  type: string;
  consultas?: Consulta[];
};

const initialState: AgendaStore = {
  consultas: [],
  agendadas: [],
  salaDeEspera: [],
  emAtendimento: [],
  concluidas: [],
  ausentes: [],
};

const CARREGAR_CONSULTAS = 'CARREGAR_CONSULTAS';
const LIMPAR_AGENDA = 'LIMPAR_AGENDA';

function carregarConsultasHandler(state = initialState, action?: Action): AgendaStore {
  if (!action) return { ...state };

  const { consultas = [] } = action;

  const [
    agendadas,
    salaDeEspera,
    emAtendimento,
    concluidas,
    ausentes,
  ] = consultas.reduce((acc, crr) => {
    const { status, id } = crr;
    if (status && id) acc[status - 1].push(id);
    return acc;
  }, new Array<number[]>(5).fill([]));

  return {
    ...state,
    consultas,
    agendadas,
    salaDeEspera,
    emAtendimento,
    concluidas,
    ausentes,
  };
}

function limparAgendaHandler(): AgendaStore {
  return { ...initialState };
}

const reducer: Reducer = (state: AgendaStore = initialState, action: Action): AgendaStore => {
  const handlers: Handlers = {
    [CARREGAR_CONSULTAS]: carregarConsultasHandler,
    [LIMPAR_AGENDA]: limparAgendaHandler,
  };

  const undefinedHandler = (): AgendaStore => ({ ...state });

  return (handlers[action.type] || undefinedHandler)(state, action);
};

export function carregarConsultas(consultas: Consulta[]): Action {
  return {
    type: CARREGAR_CONSULTAS,
    consultas,
  };
}

export function limparAgenda(): Action {
  return {
    type: LIMPAR_AGENDA,
  };
}

export default reducer;
