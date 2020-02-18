/* eslint-disable @typescript-eslint/no-var-requires */

const FichaMedicaDetalhe = require('../../db/models/FichaMedicaDetalhe');

module.exports = {
  detalhes: async (fichaMedica) => {
    const detalhes = await FichaMedicaDetalhe.findAll({ where: { fichaMedicaId: fichaMedica.id } });

    return detalhes.map((d) => d.toJSON());
  },
};
