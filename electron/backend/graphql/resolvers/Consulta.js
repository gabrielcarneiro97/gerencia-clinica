/* eslint-disable @typescript-eslint/no-var-requires */

const ConsultaProcedimento = require('../../db/models/ConsultaProcedimento');

module.exports = {
  procedimentos: async (consulta) => {
    const procedimentos = await ConsultaProcedimento.findAll(
      { where: { consultaId: consulta.id } },
    );

    return procedimentos.map((p) => p.toJSON());
  },
};
