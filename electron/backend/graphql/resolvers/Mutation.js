/* eslint-disable @typescript-eslint/no-var-requires */

const Consulta = require('../../db/models/Consulta');
const ConsultaProcedimento = require('../../db/models/ConsultaProcedimento');

async function defaultMutation({ id, del, ...dados }, Type) {
  if (id) {
    const obj = await Type.findByPk(id);

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
};
