import {
  ApolloClient, HttpLink, InMemoryCache, gql,
} from '@apollo/client';

import {
  Consulta, Paciente, Contato, ConsultaProcedimento, Endereco, PacienteGrupo,
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
  },
});

const consultaDb = {
  getById: async (consultaId: number): Promise<Consulta> => {
    const query = gql`
      query Consulta($consultaId: Int!) {
        consulta(id: $consultaId) {
          id, data, responsavel,
          observacoes, status, pacienteId,
          procedimentos {
            id, descricao
          }
        }
      }
    `;

    const res = await apolloClient.query({ query, variables: { consultaId } });

    return res.data.consulta;
  },
  findByDate: async (data: Date): Promise<Consulta[]> => {
    const query = gql`
      query Consultas($data: String) {
        consultas(data: $data) {
          id, status
        }
      }
    `;

    const res = await apolloClient.query({ query, variables: { data: data.toISOString() } });

    return res.data.consultas;
  },
  updateStatus: async (id: number, status: number): Promise<boolean> => {
    const mutation = gql`
      mutation Consulta($consulta: ConsultaInput) {
        saveConsulta(consulta: $consulta) {
          id
        }
      }
    `;

    await apolloClient.mutate({ mutation, variables: { consulta: { id, status } } });


    return true;
  },
  save: async (consulta: Consulta): Promise<number> => {
    const mutation = gql`
      mutation Consulta($consulta: ConsultaInput) {
        saveConsulta(consulta: $consulta) {
          id
        }
      }
    `;

    try {
      const res = await apolloClient.mutate({ mutation, variables: { consulta } });
      return res.data.saveConsulta.id;
    } catch (err) {
      console.log(err);
      if (err.networkError) console.log(err.networkError.result.errors);
      return -1;
    }
  },
  delById: async (consultaId: number): Promise<boolean> => {
    const mutation = gql`
      mutation Consulta($consultaId: Int) {
        deleteConsulta(id: $consultaId) {
          id
        }
      }
    `;

    try {
      await apolloClient.mutate({ mutation, variables: { consultaId } });
      return true;
    } catch (err) {
      console.log(err.networkError.result.errors);
      return false;
    }
  },
};

const consultaProcedimentoDb = {
  save: async (
    procedimento: ConsultaProcedimento,
  ): Promise<boolean> => {
    const mutation = gql`
      mutation ConsultaProcedimento($procedimento: ConsultaProcedimentoInput) {
        saveConsultaProcedimento(consultaProcedimento: $procedimento) {
          id
        }
      }
    `;

    try {
      await apolloClient.mutate({ mutation, variables: { procedimento } });
      return true;
    } catch (err) {
      console.log(err);
      if (err.networkError) console.log(err.networkError.result.errors);
      return false;
    }
  },
  delById: async (
    id?: number,
  ): Promise<boolean> => {
    const mutation = gql`
    mutation Consulta($id: Int) {
      deleteConsultaProcedimento(id: $id) {
        id
      }
    }
  `;

    if (!id && id !== 0) return false;

    try {
      await apolloClient.mutate({ mutation, variables: { id } });
      return true;
    } catch (err) {
      console.log(err.networkError.result.errors);
      return false;
    }
  },
};

const pacienteDb = {
  getById: async (pacienteId: number): Promise<Paciente> => {
    const query = gql`
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
          contato {
            id, telefone1, telefone2, email
          }
          fichaMedica {
            id, tipoSangue, altura
          }
          grupo1 {
            id, descricao, tipo
          }
          grupo2 {
            id, descricao, tipo
          }
          consultas {
            id, data, responsavel,
            observacoes, status
          }
        }
      }
    `;

    const res = await apolloClient.query({ query, variables: { pacienteId } });

    return res.data.paciente;
  },
  findByName: async (nome: string): Promise<Paciente[]> => {
    const query = gql`
      query Pacientes($nome: String!) {
        pacientes(nome: $nome) {
          id, nome
        }
      }
    `;
    const res = await apolloClient.query({ query, variables: { nome } });

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
      const mutation = gql`
        mutation Endereco($endereco: EnderecoInput) {
          saveEndereco(endereco: $endereco) {
            id
          }
        }
      `;
      const enderecoRes = await apolloClient.mutate({ mutation, variables: { endereco } });
      enderecoId = enderecoRes.data.saveEndereco.id;
    }

    if (contato) {
      const mutation = gql`
        mutation Contato($contato: ContatoInput) {
          saveContato(contato: $contato) {
            id
          }
        }
      `;
      const contatoRes = await apolloClient.mutate({ mutation, variables: { contato } });
      contatoId = contatoRes.data.saveContato.id;
    }

    const pacienteNew = {
      ...paciente,
      enderecoId: paciente.enderecoId || enderecoId,
      contatoId: paciente.contatoId || contatoId,
    };

    const mutation = gql`
      mutation Paciente($pacienteNew: PacienteInput) {
        savePaciente(paciente: $pacienteNew) { id }
      }
    `;

    const res = await apolloClient.mutate({ mutation, variables: { pacienteNew } });

    return res.data.savePaciente.id;
  },
};

const pacienteGrupoDb = {
  getAll: async (): Promise<PacienteGrupo[]> => {
    const query = gql`
      query PacienteGrupos {
        pacienteGrupos {
          id, descricao, tipo
        }
      }
    `;

    const res = await apolloClient.query({ query });

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
    const query = gql`
      query Consultas($pacienteId: Int!) {
        paciente(id: $pacienteId) {
          consultas {
            id, data, responsavel,
            observacoes, status
            procedimentos {
              id, descricao
            }
          }
        }
      }
    `;

    const res = await apolloClient.query({ query, variables: { pacienteId } });

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
