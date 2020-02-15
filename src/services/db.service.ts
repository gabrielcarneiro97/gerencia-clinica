import { gql } from '@apollo/client';
import { request } from './ipcSender.service';
import apolloClient from './graphql.service';

import {
  Consulta, Paciente, Contato, ConsultaProcedimento, Endereco, PacienteGrupo,
} from '../types';


export const consultaDb = {
  getById: async (consultaId: number): Promise<Consulta> => {
    const query = gql`
      query Consulta($consultaId: Int!) {
        consulta(id: $consultaId) {
          id, data, responsavel,
          observacoes, status, pacienteId
        }
      }
    `;

    const res = await apolloClient.query({ query, variables: { consultaId } });

    return res.data.consulta;
  },
  findByPacienteId: async (pacienteId?: number): Promise<Consulta[]> => {
    const query = gql`
      query Consultas($pacienteId: Int) {
        consultas(pacienteId: $pacienteId) {
          id, data, responsavel,
          observacoes, status, pacienteId
        }
      }
    `;
    const res = await apolloClient.query({ query, variables: { pacienteId } });

    return res.data.consultas;
  },
  findByDate: async (data: Date): Promise<Consulta[]> => {
    const query = gql`
      query Consultas($data: String) {
        consultas(data: $data) {
          id, data, responsavel,
          observacoes, status, pacienteId
        }
      }
    `;

    const res = await apolloClient.query({ query, variables: { data: data.toISOString() } });

    return res.data.consultas;
  },
  updateStatus: async (consultaId: number, status: number): Promise<boolean> => request('consulta.updateStatus', { consultaId, status }),
  save: async (consulta: Consulta): Promise<number> => request('consulta.save', consulta),
  delById: async (consultaId: number): Promise<boolean> => request('consulta.delById', consultaId),
};

export const consultaProcedimentoDb = {
  findAll: async (
    findAll: object,
  ): Promise<ConsultaProcedimento[]> => request(
    'consultaProcedimento.findAll', findAll,
  ),
  save: async (
    procedimento: ConsultaProcedimento,
  ): Promise<boolean> => request('consultaProcedimento.save', procedimento),
  destroy: async (
    procedimento: ConsultaProcedimento,
  ): Promise<boolean> => request('consultaProcedimento.destroy', procedimento),
};

export const contatoDb = {
  getById: async (contatoId: number): Promise<Contato> => request('contato.getById', contatoId),
};

export const pacienteDb = {
  getById: async (pacienteId: number): Promise<Paciente> => request('paciente.getById', pacienteId),
  findAll: async (findAll: object): Promise<Paciente[]> => request('paciente.findAll', findAll),
  findByName: async (nome: string): Promise<Paciente[]> => {
    const query = gql`
      query Pacientes($nome: String!) {
        pacientes(nome: $nome) {
          id, cpf, nome, filiacao1
          filiacao2, sexo, nascimento,
          enderecoId, grupo1Id, grupo2Id,
          contatoId, fichaMedicaId
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
  ): Promise<number> => request('paciente.saveAll', { paciente, endereco, contato }),
};

export const enderecoDb = {
  getById: async (enderecoId: number): Promise<Endereco> => request('endereco.getById', enderecoId),
};

export const pacienteGrupoDb = {
  getAll: async (): Promise<PacienteGrupo[]> => request('pacienteGrupo.getAll'),
};

export const pacienteMethods = {
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
  getContato: async (paciente: Paciente): Promise<Contato | null> => {
    const { contatoId } = paciente;
    if (!contatoId) return null;
    return contatoDb.getById(contatoId);
  },
  getEndereco: async (paciente: Paciente): Promise<Endereco | null> => {
    const { enderecoId } = paciente;

    if (!enderecoId) return null;

    return enderecoDb.getById(enderecoId);
  },
  getConsultas: async (paciente: Paciente): Promise<Consulta[]> => consultaDb.findByPacienteId(paciente.id),
};

export const consultaMethods = {
  getProcedimentos: async (consulta: Consulta): Promise<ConsultaProcedimento[]> => {
    const { id } = consulta;

    return consultaProcedimentoDb.findAll({
      where: {
        consultaId: id,
      },
    });
  },
};
