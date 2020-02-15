/* eslint-disable @typescript-eslint/no-var-requires */

const Paciente = require('../../db/models/Paciente');
const Endereco = require('../../db/models/Endereco');
const Contato = require('../../db/models/Contato');

const Consulta = require('../../db/models/Consulta');
const ConsultaProcedimento = require('../../db/models/ConsultaProcedimento');

async function defaultMutation({ id, del, ...dados }, Type) {
  console.log(dados);
  if (id) {
    const obj = await Type.findByPk(id);

    console.log(del);

    if (del) await obj.destroy();
    else await obj.update(dados);

    return obj;
  }


  const obj = await Type.create(dados);

  return obj;
}

module.exports = {
  consulta: (_, data) => defaultMutation(data, Consulta),

  consultaProcedimento: (_, data) => defaultMutation(data, ConsultaProcedimento),

  paciente: (_, data) => defaultMutation(data, Paciente),

  endereco: (_, data) => defaultMutation(data, Endereco),

  contato: (_, data) => defaultMutation(data, Contato),
};
