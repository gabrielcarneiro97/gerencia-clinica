/* eslint-disable @typescript-eslint/no-var-requires */

const ConsultaProcedimento = require('../../db/models/ConsultaProcedimento');
const Paciente = require('../../db/models/Paciente');

module.exports = {
  procedimentos: async (consulta) => {
    const procedimentos = await ConsultaProcedimento.findAll(
      { where: { consultaId: consulta.id } },
    );

    return procedimentos.map((p) => p.toJSON());
  },
  paciente: async (consulta) => {
    const { pacienteId } = consulta;
    const paciente = await Paciente.findByPk(pacienteId);
    return paciente.toJSON();
  },
};
