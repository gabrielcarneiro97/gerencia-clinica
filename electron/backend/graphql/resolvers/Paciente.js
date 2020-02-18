/* eslint-disable @typescript-eslint/no-var-requires */

const Endereco = require('../../db/models/Endereco');
const Contato = require('../../db/models/Contato');
const FichaMedica = require('../../db/models/FichaMedica');
const PacienteGrupo = require('../../db/models/PacienteGrupo');
const Consulta = require('../../db/models/Consulta');


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
  consultas: async (paciente) => {
    const consultas = await Consulta.findAll({ where: { pacienteId: paciente.id } });
    return consultas.map((c) => c.toJSON());
  },
};
