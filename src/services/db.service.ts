import { request } from './ipcSender.service';

import { Consulta, Paciente, Contato } from '../types';

export const consultaDb = {
  getById: async (consultaId: number): Promise<Consulta> => request<Consulta>('consulta.getById', consultaId),
};

export const contatoDb = {
  getById: async (contatoId: number): Promise<Contato> => request<Contato>('contato.getById', contatoId),
};

export const pacienteDb = {
  getById: async (pacienteId: number): Promise<Paciente> => request<Paciente>('paciente.getById', pacienteId),
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
};

export function getEndereco(enderecoId: number) {

}
