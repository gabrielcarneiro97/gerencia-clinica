import { Reducer } from 'redux';

import Paciente from '../db/models/Paciente';
import Endereco from '../db/models/Endereco';
import Contato from '../db/models/Contato';
import Consulta from '../db/models/Consulta';

type Handlers = { [key: string]: (state?: PacienteStore, action?: Action) => PacienteStore };

export type PacienteStore = {
  infosPessoais: Paciente | null;
  endereco: Endereco | null;
  contato: Contato | null;
  consultas: Consulta[] | [];
  diferenteDoDb: boolean;
};

type Action = {
  type: string;
  infosPessoais?: Paciente;
  endereco?: Endereco;
  contato?: Contato;
  consultas?: Consulta[];
  consulta?: Consulta;
  consultaIndex?: number;
};

const initialState: PacienteStore = {
  infosPessoais: null,
  endereco: null,
  contato: null,
  consultas: [],
  diferenteDoDb: false,
};

const CARREGAR_INFOS_PESSOAIS = 'CARREGAR_INFOS_PESSOAIS';
const CARREGAR_ENDERECO = 'CARREGAR_ENDERECO';
const CARREGAR_CONTATO = 'CARREGAR_CONTATO';
const CARREGAR_CONSULTAS = 'CARREGAR_CONSULTAS';
const ADICIONAR_CONSULTA = 'ADICIONAR_CONSULTA';
const MODIFICAR_CONSULTA = 'MODIFICAR_CONSULTA';
const REMOVER_CONSULTA = 'REMOVER_CONSULTA';
const MUDOU_PACIENTE = 'MUDOU_PACIENTE';
const PERSISTIDO_PACIENTE = 'PERSISTIDO_PACIENTE';
const LIMPAR_PACIENTE = 'LIMPAR_PACIENTE';

function carregarInfosPessoaisHandler(state = initialState, action?: Action): PacienteStore {
  if (!action) return { ...state };

  const { infosPessoais = null } = action;

  return {
    ...state,
    infosPessoais,
  };
}

function carregarEnderecoHandler(state = initialState, action?: Action): PacienteStore {
  if (!action) return { ...state };

  const { endereco = null } = action;

  return {
    ...state,
    endereco,
  };
}

function carregarContatoHandler(state = initialState, action?: Action): PacienteStore {
  if (!action) return { ...state };

  const { contato = null } = action;

  return {
    ...state,
    contato,
  };
}

function carregarConsultasHandler(state = initialState, action?: Action): PacienteStore {
  if (!action) return { ...state };

  const { consultas = [] } = action;

  return {
    ...state,
    consultas,
  };
}

function adicionarConsultaHandler(state = initialState, action?: Action): PacienteStore {
  if (!action) return { ...state };

  const { consulta } = action;

  if (!consulta) return { ...state };

  const consultas = [...state.consultas];

  consultas.push(consulta);

  return {
    ...state,
    consultas,
  };
}

function modificarConsultaHandler(state = initialState, action?: Action): PacienteStore {
  if (!action) return { ...state };

  const { consulta, consultaIndex } = action;

  if (!consulta || (!consultaIndex && consultaIndex !== 0)) return { ...state };

  const consultas = [...state.consultas];

  consultas[consultaIndex] = consulta;

  return {
    ...state,
    consultas,
  };
}

function removerConsultaHandler(state = initialState, action?: Action): PacienteStore {
  if (!action) return { ...state };

  const { consultaIndex } = action;

  if (!consultaIndex && consultaIndex !== 0) return { ...state };

  const consultas = [...state.consultas];

  consultas.splice(consultaIndex, 1);

  return {
    ...state,
    consultas,
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
    [CARREGAR_INFOS_PESSOAIS]: carregarInfosPessoaisHandler,
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

export function carregarInfosPessoais(infosPessoais: Paciente): Action {
  return {
    type: CARREGAR_INFOS_PESSOAIS,
    infosPessoais,
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
