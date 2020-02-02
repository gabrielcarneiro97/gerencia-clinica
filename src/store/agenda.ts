import { Reducer } from 'redux';

import { Consulta } from '../types';

type Handlers = { [key: string]: (state?: AgendaStore, action?: Action) => AgendaStore };

export type AgendaStore = {
  boards: Array<number[]>;
};

type Action = {
  type: string;
  consultas?: Consulta[];
  boardId?: number;
  elementId?: number;
  element?: number;
};

const initialState: AgendaStore = {
  boards: [[], [], [], [], []],
};

const CARREGAR_CONSULTAS = 'CARREGAR_CONSULTAS';
const LIMPAR_AGENDA = 'LIMPAR_AGENDA';
const ACHAR_E_REMOVER_BOARD_ELEMENT = 'ACHAR_E_REMOVER_BOARD_ELEMENT';
const REMOVER_BOARD_ELEMENT = 'REMOVER_BOARD_ELEMENT';
const ADICIONAR_BOARD_ELEMENT = 'ADICIONAR_BOARD_ELEMENT';

function carregarConsultasHandler(state = initialState, action?: Action): AgendaStore {
  if (!action) return { ...state };

  const { consultas = [] } = action;

  const emptyArr: Array<number[]> = [[], [], [], [], []];

  const boards = consultas.reduce((acc, crr) => {
    const { status, id } = crr;
    if (status && id) acc[status - 1].push(id);
    return acc;
  }, emptyArr);

  return {
    ...state,
    boards,
  };
}

function acharERemoverBoardElementHandler(state = initialState, action?: Action): AgendaStore {
  if (!action) return { ...state };

  const { boards } = state;
  const { element } = action;

  if (!element && element !== 0) return { ...state };

  const newBoards = [...boards];

  const boardId = newBoards.findIndex((nums) => nums.includes(element));

  if (boardId === -1) return { ...state };

  const newBoard = [...newBoards[boardId]];

  const elementId = newBoard.findIndex((el) => el === element);

  newBoard.splice(elementId, 1);

  newBoards[boardId] = newBoard;

  return {
    ...state,
    boards: newBoards,
  };
}

function removerBoardElementHandler(state = initialState, action?: Action): AgendaStore {
  if (!action) return { ...state };

  const { boards } = state;
  const { boardId, elementId } = action;

  if (((!boardId && boardId !== 0) || (!elementId && elementId !== 0))) return { ...state };

  const newBoards = [...boards];

  const newBoard = [...newBoards[boardId]];

  newBoard.splice(elementId, 1);

  newBoards[boardId] = newBoard;


  return {
    ...state,
    boards: newBoards,
  };
}

function adicionarBoardElementHandler(state = initialState, action?: Action): AgendaStore {
  if (!action) return { ...state };

  const { boards } = state;
  const { boardId, elementId, element } = action;


  if (
    (!boardId && boardId !== 0)
    || (!elementId && elementId !== 0)
    || (!element && element !== 0)
  ) return { ...state };

  const newBoards = [...boards];

  const newBoard = [...newBoards[boardId]];

  if (elementId === -1) newBoard.push(element);
  else newBoard.splice(elementId, 0, element);

  newBoards[boardId] = newBoard;

  return {
    ...state,
    boards: newBoards,
  };
}

function limparAgendaHandler(): AgendaStore {
  return { ...initialState };
}

const reducer: Reducer = (state: AgendaStore = initialState, action: Action): AgendaStore => {
  const handlers: Handlers = {
    [CARREGAR_CONSULTAS]: carregarConsultasHandler,
    [ACHAR_E_REMOVER_BOARD_ELEMENT]: acharERemoverBoardElementHandler,
    [REMOVER_BOARD_ELEMENT]: removerBoardElementHandler,
    [ADICIONAR_BOARD_ELEMENT]: adicionarBoardElementHandler,
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

export function acharERemoverBoardElement(element: number): Action {
  return {
    type: ACHAR_E_REMOVER_BOARD_ELEMENT,
    element,
  };
}

export function removerBoardElement(boardId: number, elementId: number): Action {
  return {
    type: REMOVER_BOARD_ELEMENT,
    boardId,
    elementId,
  };
}

export function adicionarBoardElement(boardId: number, elementId: number, element: number): Action {
  return {
    type: ADICIONAR_BOARD_ELEMENT,
    boardId,
    elementId,
    element,
  };
}

export function limparAgenda(): Action {
  return {
    type: LIMPAR_AGENDA,
  };
}

export default reducer;
