import { request } from './ipcSender.service';

import {
  Consulta, Paciente, Contato, ConsultaProcedimento, Endereco,
} from '../types';

export const consultaDb = {
  getById: async (consultaId: number): Promise<Consulta> => request<Consulta>('consulta.getById', consultaId),
  findAll: async (findAll: object): Promise<Consulta[]> => request<Consulta[]>('consulta.findAll', findAll),
  save: async (consulta: Consulta): Promise<boolean> => request<boolean>('consulta.save', consulta),
  delById: async (consultaId: number): Promise<boolean> => request<boolean>('consulta.delById', consultaId),
};

export const consultaProcedimentoDb = {
  findAll: async (
    findAll: object,
  ): Promise<ConsultaProcedimento[]> => request<ConsultaProcedimento[]>(
    'consultaProcedimento.findAll', findAll,
  ),
  save: async (
    procedimento: ConsultaProcedimento,
  ): Promise<boolean> => request<boolean>('consultaProcedimento.save', procedimento),
  destroy: async (
    procedimento: ConsultaProcedimento,
  ): Promise<boolean> => request<boolean>('consultaProcedimento.destroy', procedimento),
};

export const contatoDb = {
  getById: async (contatoId: number): Promise<Contato> => request<Contato>('contato.getById', contatoId),
};

export const pacienteDb = {
  getById: async (pacienteId: number): Promise<Paciente> => request<Paciente>('paciente.getById', pacienteId),
  findAll: async (findAll: object): Promise<Paciente[]> => request<Paciente[]>('paciente.findAll', findAll),
  findByName: async (nome: string): Promise<Paciente[]> => request<Paciente[]>('paciente.findByName', nome),
  saveAll: async (
    paciente: Paciente,
    endereco?: Endereco | null,
    contato?: Contato | null,
  ): Promise<boolean> => request<boolean>('paciente.saveAll', { paciente, endereco, contato }),
};

export const enderecoDb = {
  getById: async (enderecoId: number): Promise<Endereco> => request<Endereco>('endereco.getById', enderecoId),
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
  getConsultas: async (paciente: Paciente): Promise<Consulta[]> => consultaDb.findAll({
    where: {
      pacienteId: paciente.id,
    },
  }),
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
