import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  gql,
  QueryBaseOptions,
  MutationOptions,
  ApolloQueryResult,
  FetchResult,
  useQuery,
  useLazyQuery,
  useMutation,
} from '@apollo/client';

import {
  Consulta,
  Paciente,
  Contato,
  ConsultaProcedimento,
  Endereco,
  PacienteGrupo,
} from '../types';

const apolloClient = new ApolloClient({
  cache: new InMemoryCache({ addTypename: false }),
  link: new HttpLink({
    uri: 'http://localhost:4000',
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
    mutate: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore',
    },
  },
});

async function executeMutation(mutation: MutationOptions): Promise<FetchResult<{
  [key: string]: any;
}, Record<string, any>, Record<string, any>>> {
  try {
    return apolloClient.mutate(mutation);
  } catch (err) {
    console.log(err);
    if (err.networkError) console.log(err.networkError.result.errors);
    throw err;
  }
}

async function executeQuery<T = any>(query: QueryBaseOptions): Promise<ApolloQueryResult<T>> {
  try {
    return apolloClient.query(query);
  } catch (err) {
    if (err.networkError) console.log(err.networkError.result.errors);
    console.log(err);
    throw err;
  }
}

const queries = {
  CONSULTA: (consultaId?: number): QueryBaseOptions => ({
    query: gql`
      query Consulta($consultaId: Int!) {
        consulta(id: $consultaId) {
          id, data, responsavel,
          observacoes, status, pacienteId,
          procedimentos { id, descricao }
        }
      }
    `,
    variables: { consultaId },
  }),
  CONSULTAS_BY_DATE: (data?: Date): QueryBaseOptions => ({
    query: gql`
      query Consultas($data: String) {
        consultas(data: $data) {
          id, status
        }
      }
    `,
    variables: { data: data?.toISOString() },
  }),
  CONSULTAS_BY_PACIENTE_ID: (pacienteId?: number): QueryBaseOptions => ({
    query: gql`
      query Consultas($pacienteId: Int!) {
        paciente(id: $pacienteId) {
          consultas {
            id, data, responsavel,
            observacoes, status
            procedimentos { id, descricao }
          }
        }
      }
    `,
    variables: { pacienteId },
  }),
  CONSULTA_PACIENTE: (consultaId: number): QueryBaseOptions => ({
    query: gql`
      query ConsultaPaciente($consultaId: Int!) {
        consultaPaciente(id: $consultaId) {
          consulta {
            id, data, responsavel, status
          }
          paciente {
            nome, contato { telefone1 }
          }
        }
      }
    `,
    variables: { consultaId },
  }),
  PACIENTE: (pacienteId?: number): QueryBaseOptions => ({
    query: gql`
      query Paciente($pacienteId: Int!) {
        paciente(id: $pacienteId) {
          id, cpf, nome, filiacao1
          filiacao2, sexo, nascimento
          enderecoId, grupo1Id, grupo2Id
          contatoId, fichaMedicaId,
          endereco {
            id, logradouro, numero, complemento,
            bairro, cidade, estado, pais, cep
          }
          contato { id, telefone1, telefone2, email }
          fichaMedica { id, tipoSangue, altura }
          grupo1 { id, descricao, tipo }
          grupo2 { id, descricao, tipo }
          consultas {
            id, data, responsavel,
            observacoes, status
          }
        }
      }
    `,
    variables: { pacienteId },
  }),
  PACIENTES_BY_NAME: (nome: string): QueryBaseOptions => ({
    query: gql`
      query Pacientes($nome: String!) {
        pacientes(nome: $nome) { id, nome }
      }
    `,
    variables: { nome },
  }),
  PACIENTE_GRUPOS: (): QueryBaseOptions => ({
    query: gql`
      query PacienteGrupos {
        pacienteGrupos { id, descricao, tipo }
      }
    `,
  }),
};

const mutations = {
  SAVE_CONSULTA: (consulta?: Consulta): MutationOptions => ({
    mutation: gql`
      mutation Consulta($consulta: ConsultaInput) {
        saveConsulta(consulta: $consulta) { id }
      }
    `,
    variables: { consulta },
  }),
  DELETE_CONSULTA: (consultaId?: number): MutationOptions => ({
    mutation: gql`
      mutation Consulta($consultaId: Int) {
        deleteConsulta(id: $consultaId) { id }
      }
    `,
    variables: { consultaId },
  }),
  SAVE_PROCEDIMENTO: (procedimento?: ConsultaProcedimento): MutationOptions => ({
    mutation: gql`
      mutation ConsultaProcedimento($procedimento: ConsultaProcedimentoInput) {
        saveConsultaProcedimento(consultaProcedimento: $procedimento) { id }
      }
    `,
    variables: { procedimento },
  }),
  DELETE_PROCEDIMENTO: (id?: number): MutationOptions => ({
    mutation: gql`
      mutation ConsultaProcedimento($id: Int) {
        deleteConsultaProcedimento(id: $id) { id }
      }
    `,
    variables: { id },
  }),
  SAVE_PACIENTE: (paciente?: Paciente): MutationOptions => ({
    mutation: gql`
      mutation Paciente($paciente: PacienteInput) {
        savePaciente(paciente: $paciente) { id }
      }
    `,
    variables: { paciente },
  }),
  SAVE_ENDERECO: (endereco?: Endereco): MutationOptions => ({
    mutation: gql`
      mutation Endereco($endereco: EnderecoInput) {
        saveEndereco(endereco: $endereco) { id }
      }
    `,
    variables: { endereco },
  }),
  SAVE_CONTATO: (contato?: Contato): MutationOptions => ({
    mutation: gql`
      mutation Contato($contato: ContatoInput) {
        saveContato(contato: $contato) { id }
      }
    `,
    variables: { contato },
  }),
};

type ConsultaPaciente = { consulta: Consulta; paciente: Paciente };

export const hooks = {
  /* CONSULTA BEGIN */
  // Queries
  useConsulta: (consultaId: number) => {
    const { query, ...options } = queries.CONSULTA(consultaId);
    return useQuery<{ consulta: Consulta }>(query, options);
  },
  useConsultaLazy: (consultaId?: number) => {
    const { query, ...options } = queries.CONSULTA(consultaId);
    return useLazyQuery<{ consulta: Consulta }>(query, options);
  },
  useConsultasByDateLazy: (data?: Date) => {
    const { query, ...options } = queries.CONSULTAS_BY_DATE(data);
    return useLazyQuery<{ consultas: Consulta[] }>(query, options);
  },
  useConsultasByPacienteIdLazy: (pacienteId?: number) => {
    const { query, ...options } = queries.CONSULTAS_BY_PACIENTE_ID(pacienteId);
    return useLazyQuery<{ consultas: Consulta[] }>(query, options);
  },
  // Mutations
  useSaveConsulta: () => {
    const { mutation } = mutations.SAVE_CONSULTA();
    return useMutation<{ saveConsulta: { id: number } }>(mutation);
  },
  useDeleteConsulta: () => {
    const { mutation } = mutations.DELETE_CONSULTA();
    return useMutation<{ deleteConsulta: { id: number } }>(mutation);
  },
  /* CONSULTA END */
  /* PACIENTE BEGIN */
  // Queries
  usePaciente: (pacienteId: number) => {
    const { query, ...options } = queries.PACIENTE(pacienteId);
    return useQuery<{ paciente: Paciente }>(query, options);
  },
  usePacienteLazy: (pacienteId?: number) => {
    const { query, ...options } = queries.PACIENTE();
    return useLazyQuery<{ paciente: Paciente }>(query, options);
  },
  usePacientesByNameLazy: (nome = '') => {
    const { query, ...options } = queries.PACIENTES_BY_NAME(nome);
    return useLazyQuery<{ pacientes: Paciente[] }>(query, options);
  },
  // Mutations
  useSavePaciente: (paciente?: Paciente) => {
    const { mutation } = mutations.SAVE_PACIENTE(paciente);
    return useMutation<{ savePaciente: { id: number } }>(mutation);
  },
  /* PACIENTE END */
  /* ENDERECO BEGIN */
  // Mutations
  useSaveEndereco: (endereco?: Endereco) => {
    const { mutation } = mutations.SAVE_ENDERECO(endereco);
    return useMutation<{ saveEndereco: { id: number } }>(mutation);
  },
  /* ENDERECO END */
  /* CONTATO BEGIN */
  // Mutations
  useSaveContato: (contato?: Contato) => {
    const { mutation } = mutations.SAVE_CONTATO(contato);
    return useMutation<{ saveContato: { id: number } }>(mutation);
  },
  /* CONTATO END */
  /* CONSULTA_PACIENTE BEGIN */
  // Queries
  useConsultaPaciente: (consultaId: number) => {
    const { query, ...options } = queries.CONSULTA_PACIENTE(consultaId);
    return useQuery<{ consultaPaciente: ConsultaPaciente }>(query, options);
  },
  /* CONSULTA_PACIENTE END */
  /* CONSULTA_PROCEDIMENTO BEGIN */
  // Mutations
  useDeleteProcedimento: (id?: number) => {
    const { mutation } = mutations.DELETE_PROCEDIMENTO(id);
    return useMutation<{ deleteConsultaProcedimento: { id: number } }>(mutation);
  },
  useSaveProcedimento: (procedimento?: ConsultaProcedimento) => {
    const { mutation } = mutations.SAVE_PROCEDIMENTO(procedimento);
    return useMutation<{ saveConsultaProcedimento: { id: number } }>(mutation);
  },
  /* CONSULTA_PROCEDIMENTO END */
  /* PACIENTE_GRUPO BEGIN */
  // Queries
  usePacienteGrupos: () => {
    const { query } = queries.PACIENTE_GRUPOS();
    return useQuery<{ pacienteGrupos: PacienteGrupo[] }>(query);
  },
  /* PACIENTE_GRUPO END */
};

const consultaDb = {
  getById: async (consultaId: number): Promise<Consulta> => {
    const res = await executeQuery(queries.CONSULTA(consultaId));
    return res.data.consulta;
  },
  findByDate: async (data: Date): Promise<Consulta[]> => {
    try {
      const res = await executeQuery(queries.CONSULTAS_BY_DATE(data));
      return res.data.consultas;
    } catch {
      return [];
    }
  },
  updateStatus: async (id: number, status: number): Promise<boolean> => {
    try {
      await executeMutation(mutations.SAVE_CONSULTA({ id, status }));
      return true;
    } catch {
      return false;
    }
  },
  save: async (consulta: Consulta): Promise<number> => {
    try {
      const res = await executeMutation(mutations.SAVE_CONSULTA(consulta));
      return res?.data?.saveConsulta.id ?? -99;
    } catch {
      return -1;
    }
  },
  delById: async (consultaId: number): Promise<boolean> => {
    try {
      await executeMutation(mutations.DELETE_CONSULTA(consultaId));
      return true;
    } catch {
      return false;
    }
  },
};

const consultaProcedimentoDb = {
  save: async (
    procedimento: ConsultaProcedimento,
  ): Promise<boolean> => {
    try {
      await executeMutation(mutations.SAVE_PROCEDIMENTO(procedimento));
      return true;
    } catch {
      return false;
    }
  },
  delById: async (
    id?: number,
  ): Promise<boolean> => {
    if (!id && id !== 0) return false;

    try {
      await executeMutation(mutations.DELETE_PROCEDIMENTO(id));
      return true;
    } catch {
      return false;
    }
  },
};

const pacienteDb = {
  getById: async (pacienteId: number): Promise<Paciente> => {
    const res = await executeQuery(queries.PACIENTE(pacienteId));
    return res.data.paciente;
  },
  findByName: async (nome: string): Promise<Paciente[]> => {
    const res = await executeQuery(queries.PACIENTES_BY_NAME(nome));
    return res.data.pacientes;
  },
  saveAll: async (
    paciente: Paciente,
    endereco?: Endereco | null,
    contato?: Contato | null,
  ): Promise<number> => {
    let enderecoId: number | null = null;
    let contatoId: number | null = null;
    if (endereco) {
      const enderecoRes = await executeMutation(mutations.SAVE_ENDERECO(endereco));
      enderecoId = enderecoRes?.data?.saveEndereco.id ?? null;
    }

    if (contato) {
      const contatoRes = await executeMutation(mutations.SAVE_CONTATO(contato));
      contatoId = contatoRes?.data?.saveContato.id ?? null;
    }

    const pacienteNew = {
      ...paciente,
      enderecoId: paciente.enderecoId || enderecoId,
      contatoId: paciente.contatoId || contatoId,
    };

    const res = await executeMutation(mutations.SAVE_PACIENTE(pacienteNew));

    return res?.data?.savePaciente.id ?? -99;
  },
};

const pacienteGrupoDb = {
  getAll: async (): Promise<PacienteGrupo[]> => {
    const res = await executeQuery(queries.PACIENTE_GRUPOS());
    return res.data.pacienteGrupos;
  },
};

const pacienteMethods = {
  getIniciais: (paciente: Paciente): string => {
    const { nome } = paciente;

    if (!nome) return '';

    const nomes = nome.split(' ');

    return nomes.reduce((acc, crr, i) => {
      if (i === 0) return crr;
      if (crr.length <= 2) return acc;
      return `${acc} ${crr[0].toUpperCase()}.`;
    }, '');
  },
  getConsultas: async (
    pacienteId: number,
  ): Promise<Consulta[]> => {
    const res = await executeQuery(queries.CONSULTAS_BY_PACIENTE_ID(pacienteId));
    return res.data.paciente.consultas;
  },
};

export const graphql = {
  consulta: consultaDb,
  consultaProcedimento: consultaProcedimentoDb,
  paciente: pacienteDb,
  pacienteGrupo: pacienteGrupoDb,
};

export const methods = {
  paciente: pacienteMethods,
};

export default apolloClient;
