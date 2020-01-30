import { Reducer } from 'redux';

import Consulta from '../../electron/backend/db/models/Consulta';
import ConsultaProcedimento from '../../electron/backend/db/models/ConsultaProcedimento';

type Handlers = { [key: string]: (state?: ConsultaStore, action?: Action) => ConsultaStore };

export type ConsultaStore = {
  infos: Consulta | null;
  procedimentos: ConsultaProcedimento[];
  procedimentosRemovidos: ConsultaProcedimento[];
  diferenteDoDb: boolean;
};

type Action = {
  type: string;
  consulta?: Consulta | null;
  procedimentos?: ConsultaProcedimento[];
  procedimento?: ConsultaProcedimento;
  procedimentoIndex?: number;
};

const initialState: ConsultaStore = {
  infos: null,
  procedimentos: [],
  procedimentosRemovidos: [],
  diferenteDoDb: false,
};

const CARREGAR_INFOS = 'CARREGAR_INFOS';
const CARREGAR_PROCEDIMENTOS = 'CARREGAR_PROCEDIMENTOS';
const ADICIONAR_PROCEDIMENTO = 'ADICIONAR_PROCEDIMENTO';
const MODIFICAR_PROCEDIMENTO = 'MODIFICAR_PROCEDIMENTO';
const REMOVER_PROCEDIMENTO = 'REMOVER_PROCEDIMENTO';
const LIMPAR_PROCEDIMENTOS_REMOVIDOS = 'LIMPAR_PROCEDIMENTOS_REMOVIDOS';
const MUDOU_CONSULTA = 'MUDOU_CONSULTA';
const PERSISTIDO_CONSULTA = 'PERSISTIDO_CONSULTA';
const LIMPAR_CONSULTA = 'LIMPAR_CONSULTA';

function carregarInfosHandler(state = initialState, action?: Action): ConsultaStore {
  if (!action) return { ...state };

  const { consulta = null } = action;

  return {
    ...state,
    infos: consulta,
  };
}

function carregarProcedimentosHandler(state = initialState, action?: Action): ConsultaStore {
  if (!action) return { ...state };

  const { procedimentos = [] } = action;

  return {
    ...state,
    procedimentos,
  };
}

function adicionarProcedimentoHandler(state = initialState, action?: Action): ConsultaStore {
  if (!action) return { ...state };

  const { procedimento } = action;

  if (!procedimento) return { ...state };

  const procedimentos = [...state.procedimentos];

  procedimentos.push(procedimento);

  return {
    ...state,
    procedimentos,
  };
}

function modificarProcedimentoHandler(state = initialState, action?: Action): ConsultaStore {
  if (!action) return { ...state };

  const { procedimento, procedimentoIndex } = action;

  if (!procedimento || (!procedimentoIndex && procedimentoIndex !== 0)) return { ...state };

  const procedimentos = [...state.procedimentos];

  procedimentos[procedimentoIndex] = procedimento;

  return {
    ...state,
    procedimentos,
  };
}

function removerProcedimentoHandler(state = initialState, action?: Action): ConsultaStore {
  if (!action) return { ...state };

  const { procedimentoIndex } = action;

  if (!procedimentoIndex && procedimentoIndex !== 0) return { ...state };

  const procedimentos = [...state.procedimentos];
  const procedimentosRemovidos = [
    ...state.procedimentosRemovidos,
    ...procedimentos.splice(procedimentoIndex, 1),
  ];

  return {
    ...state,
    procedimentos,
    procedimentosRemovidos,
  };
}

function limparProcedimentosRemovidosHandler(state = initialState, action?: Action): ConsultaStore {
  if (!action) return { ...state };

  return {
    ...state,
    procedimentosRemovidos: [],
  };
}

function mudouHandler(state = initialState, action?: Action): ConsultaStore {
  if (!action) return { ...state };

  return {
    ...state,
    diferenteDoDb: true,
  };
}

function persistidoHandler(state = initialState, action?: Action): ConsultaStore {
  if (!action) return { ...state };

  return {
    ...state,
    diferenteDoDb: false,
  };
}

function limparConsultaHandler(): ConsultaStore {
  return { ...initialState };
}

const reducer: Reducer = (state: ConsultaStore = initialState, action: Action): ConsultaStore => {
  const handlers: Handlers = {
    [CARREGAR_INFOS]: carregarInfosHandler,
    [CARREGAR_PROCEDIMENTOS]: carregarProcedimentosHandler,
    [ADICIONAR_PROCEDIMENTO]: adicionarProcedimentoHandler,
    [MODIFICAR_PROCEDIMENTO]: modificarProcedimentoHandler,
    [REMOVER_PROCEDIMENTO]: removerProcedimentoHandler,
    [LIMPAR_PROCEDIMENTOS_REMOVIDOS]: limparProcedimentosRemovidosHandler,
    [MUDOU_CONSULTA]: mudouHandler,
    [PERSISTIDO_CONSULTA]: persistidoHandler,
    [LIMPAR_CONSULTA]: limparConsultaHandler,
  };

  const undefinedHandler = (): ConsultaStore => ({ ...state });

  return (handlers[action.type] || undefinedHandler)(state, action);
};

export function carregarInfos(consulta: Consulta | null): Action {
  return {
    type: CARREGAR_INFOS,
    consulta,
  };
}

export function carregarProcedimentos(procedimentos: ConsultaProcedimento[]): Action {
  return {
    type: CARREGAR_PROCEDIMENTOS,
    procedimentos,
  };
}

export function adicionarProcedimento(procedimento: ConsultaProcedimento): Action {
  return {
    type: ADICIONAR_PROCEDIMENTO,
    procedimento,
  };
}

export function modificarProcedimento(
  procedimento: ConsultaProcedimento,
  procedimentoIndex: number,
): Action {
  return {
    type: MODIFICAR_PROCEDIMENTO,
    procedimento,
    procedimentoIndex,
  };
}

export function removerProcedimento(procedimentoIndex: number): Action {
  return {
    type: REMOVER_PROCEDIMENTO,
    procedimentoIndex,
  };
}

export function limparProcedimentosRemovidos(): Action {
  return {
    type: LIMPAR_PROCEDIMENTOS_REMOVIDOS,
  };
}

export function mudou(): Action {
  return {
    type: MUDOU_CONSULTA,
  };
}

export function persitido(): Action {
  return {
    type: PERSISTIDO_CONSULTA,
  };
}

export function limparConsulta(): Action {
  return {
    type: LIMPAR_CONSULTA,
  };
}

export default reducer;
