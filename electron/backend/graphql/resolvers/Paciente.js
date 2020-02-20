/* eslint-disable @typescript-eslint/no-var-requires */
const moment = require('moment');

const Endereco = require('../../db/models/Endereco');
const Contato = require('../../db/models/Contato');
const FichaMedica = require('../../db/models/FichaMedica');
const PacienteGrupo = require('../../db/models/PacienteGrupo');
const Consulta = require('../../db/models/Consulta');

async function getConsultas(paciente) {
  const consultas = await Consulta.findAll({ where: { pacienteId: paciente.id } });
  return consultas.map((c) => c.toJSON());
}

module.exports = {
  endereco: async (paciente) => {
    if (paciente.enderecoId === null) return null;

    const endereco = await Endereco.findByPk(paciente.enderecoId);
    return endereco.toJSON();
  },
  contato: async (paciente) => {
    if (paciente.contatoId === null) return null;

    const contato = await Contato.findByPk(paciente.contatoId);
    return contato.toJSON();
  },
  fichaMedica: async (paciente) => {
    if (paciente.fichaMedicaId === null) return null;

    const fichaMedica = await FichaMedica.findByPk(paciente.fichaMedicaId);
    return fichaMedica.toJSON();
  },
  grupo1: async (paciente) => {
    if (paciente.grupo1Id === null) return null;

    const grupo = await PacienteGrupo.findByPk(paciente.grupo1Id);
    return grupo.toJSON();
  },
  grupo2: async (paciente) => {
    if (paciente.grupo2Id === null) return null;

    const grupo = await PacienteGrupo.findByPk(paciente.grupo2Id);
    return grupo.toJSON();
  },
  consultas: async (paciente) => getConsultas(paciente),
  nomeAbreviado: async (paciente) => {
    const { nome } = paciente;

    if (!nome) return '';

    const nomes = nome.split(' ');

    return nomes.reduce((acc, crr, i) => {
      if (i === 0) return crr;
      if (crr.length <= 2 || i >= 4) return acc;
      return `${acc} ${crr[0].toUpperCase()}.`;
    }, '');
  },
  primeiraConsulta: async (paciente) => {
    const consultas = await getConsultas(paciente);
    const primeira = consultas.reduce(
      (
        prev,
        crr,
      ) => (moment(crr.data).isBefore(moment(prev.data)) ? crr.data : prev.data), new Date(),
    );
    return primeira;
  },
};
