import { Reducer } from 'redux';


import {
  Consulta,
  Paciente,
  Endereco,
  Contato,
} from '../types';

type Handlers = { [key: string]: (state?: PacienteStore, action?: Action) => PacienteStore };

export type PacienteStore = {
  paciente: Paciente;
  diferenteDoDb: boolean;
};

type Action = {
  type: string;
  paciente?: Paciente;
  endereco?: Endereco;
  contato?: Contato;
  consultas?: Consulta[];
  consulta?: Consulta;
  consultaIndex?: number;
};

const pacienteEmpty = {
  endereco: null,
  contato: null,
  fichaMedica: null,
  grupo1: null,
  grupo2: null,
  consultas: [],
};

const initialState: PacienteStore = {
  paciente: {
    endereco: null,
    contato: null,
    fichaMedica: null,
    grupo1: null,
    grupo2: null,
    consultas: [],
  },
  diferenteDoDb: false,
};

const CARREGAR_PACIENTE = 'CARREGAR_PACIENTE';
const CARREGAR_ENDERECO = 'CARREGAR_ENDERECO';
const CARREGAR_CONTATO = 'CARREGAR_CONTATO';
const CARREGAR_CONSULTAS = 'CARREGAR_CONSULTAS';
const ADICIONAR_CONSULTA = 'ADICIONAR_CONSULTA';
const MODIFICAR_CONSULTA = 'MODIFICAR_CONSULTA';
const REMOVER_CONSULTA = 'REMOVER_CONSULTA';
const MUDOU_PACIENTE = 'MUDOU_PACIENTE';
const PERSISTIDO_PACIENTE = 'PERSISTIDO_PACIENTE';
const LIMPAR_PACIENTE = 'LIMPAR_PACIENTE';

function carregarPacienteHandler(state = initialState, action?: Action): PacienteStore {
  if (!action) return { ...state };

  const { paciente = { ...pacienteEmpty } } = action;

  return {
    ...state,
    paciente,
  };
}

function carregarEnderecoHandler(state = initialState, action?: Action): PacienteStore {
  if (!action) return { ...state };

  const { endereco = null } = action;

  return {
    ...state,
    paciente: {
      ...state.paciente,
      endereco,
    },
  };
}

function carregarContatoHandler(state = initialState, action?: Action): PacienteStore {
  if (!action) return { ...state };

  const { contato = { ...pacienteEmpty } } = action;

  return {
    ...state,
    paciente: {
      ...state.paciente,
      contato,
    },
  };
}

function carregarConsultasHandler(state = initialState, action?: Action): PacienteStore {
  if (!action) return { ...state };

  const { consultas = [] } = action;

  return {
    ...state,
    paciente: {
      ...state.paciente,
      consultas,
    },
  };
}

function adicionarConsultaHandler(state = initialState, action?: Action): PacienteStore {
  if (!action) return { ...state };

  const { consulta } = action;

  if (!consulta) return { ...state };

  const consultas = [...state.paciente.consultas];

  consultas.push(consulta);

  return {
    ...state,
    paciente: {
      ...state.paciente,
      consultas,
    },
  };
}

function modificarConsultaHandler(state = initialState, action?: Action): PacienteStore {
  if (!action) return { ...state };

  const { consulta, consultaIndex } = action;

  if (!consulta || (!consultaIndex && consultaIndex !== 0)) return { ...state };

  const consultas = [...state.paciente.consultas];

  consultas[consultaIndex] = consulta;

  return {
    ...state,
    paciente: {
      ...state.paciente,
      consultas,
    },
  };
}

function removerConsultaHandler(state = initialState, action?: Action): PacienteStore {
  if (!action) return { ...state };

  const { consultaIndex } = action;

  if (!consultaIndex && consultaIndex !== 0) return { ...state };

  const consultas = [...state.paciente.consultas];

  consultas.splice(consultaIndex, 1);

  return {
    ...state,
    paciente: {
      ...state.paciente,
      consultas,
    },
  };
}

function mudouHandler(state = initialState, action?: Action): PacienteStore {
  if (!action) return { ...state };

  return {
    ...state,
    diferenteDoDb: true,
  };
}

function persistidoHandler(state = initialState, action?: Action): PacienteStore {
  if (!action) return { ...state };

  return {
    ...state,
    diferenteDoDb: false,
  };
}

function limparPacienteHandler(): PacienteStore {
  return { ...initialState };
}

const reducer: Reducer = (state: PacienteStore = initialState, action: Action): PacienteStore => {
  const handlers: Handlers = {
    [CARREGAR_PACIENTE]: carregarPacienteHandler,
    [CARREGAR_ENDERECO]: carregarEnderecoHandler,
    [CARREGAR_CONTATO]: carregarContatoHandler,
    [CARREGAR_CONSULTAS]: carregarConsultasHandler,
    [ADICIONAR_CONSULTA]: adicionarConsultaHandler,
    [MODIFICAR_CONSULTA]: modificarConsultaHandler,
    [REMOVER_CONSULTA]: removerConsultaHandler,
    [MUDOU_PACIENTE]: mudouHandler,
    [PERSISTIDO_PACIENTE]: persistidoHandler,
    [LIMPAR_PACIENTE]: limparPacienteHandler,
  };

  const newState = (handlers[action.type] || ((): PacienteStore => ({ ...state })))(state, action);

  return newState;
};

export function carregarPaciente(paciente: Paciente): Action {
  return {
    type: CARREGAR_PACIENTE,
    paciente,
  };
}

export function carregarEndereco(endereco: Endereco): Action {
  return {
    type: CARREGAR_ENDERECO,
    endereco,
  };
}

export function carregarContato(contato: Contato): Action {
  return {
    type: CARREGAR_CONTATO,
    contato,
  };
}

export function carregarConsultas(consultas: Consulta[]): Action {
  return {
    type: CARREGAR_CONSULTAS,
    consultas,
  };
}

export function adicionarConsulta(consulta: Consulta): Action {
  return {
    type: ADICIONAR_CONSULTA,
    consulta,
  };
}

export function modificarConsulta(
  consulta: Consulta,
  consultaIndex: number,
): Action {
  return {
    type: MODIFICAR_CONSULTA,
    consulta,
    consultaIndex,
  };
}

export function removerConsulta(consultaIndex: number): Action {
  return {
    type: REMOVER_CONSULTA,
    consultaIndex,
  };
}


export function mudou(): Action {
  return {
    type: MUDOU_PACIENTE,
  };
}

export function persitido(): Action {
  return {
    type: PERSISTIDO_PACIENTE,
  };
}

export function limparPaciente(): Action {
  return {
    type: LIMPAR_PACIENTE,
  };
}

export default reducer;
