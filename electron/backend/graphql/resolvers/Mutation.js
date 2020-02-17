/* eslint-disable @typescript-eslint/no-var-requires */

const Paciente = require('../../db/models/Paciente');
const Endereco = require('../../db/models/Endereco');
const Contato = require('../../db/models/Contato');

const Consulta = require('../../db/models/Consulta');
const ConsultaProcedimento = require('../../db/models/ConsultaProcedimento');

async function save(data, Type, dataName) {
  const { id, ...dados } = data[dataName];
  if (id) {
    const obj = await Type.findByPk(id);
    await obj.update(dados);
    return obj;
  }

  return Type.create(dados);
}

async function del({ id }, Type) {
  if (id) {
    const obj = await Type.findByPk(id);
    try {
      await obj.destroy();
      return obj;
    } catch (e) {
      console.error(e);
      return { id: -1 };
    }
  }

  return { id: -1 };
}

module.exports = {
  saveConsulta: (_, data) => save(data, Consulta, 'consulta'),
  deleteConsulta: (_, data) => del(data, Consulta),

  saveConsultaProcedimento: (_, data) => save(data, ConsultaProcedimento, 'consultaProcedimento'),
  deleteConsultaProcedimento: (_, data) => del(data, ConsultaProcedimento),

  savePaciente: (_, data) => save(data, Paciente, 'paciente'),

  saveEndereco: (_, data) => save(data, Endereco, 'endereco'),

  saveContato: (_, data) => save(data, Contato, 'contato'),
};
