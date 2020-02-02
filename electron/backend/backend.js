/* eslint-disable @typescript-eslint/no-var-requires */
const { Op } = require('sequelize');
const moment = require('moment');

const { initListener, createListener } = require('./services/ipcListener.service');
const dbInit = require('./db/db.service');

const Consulta = require('./db/models/Consulta');
const Contato = require('./db/models/Contato');
const Paciente = require('./db/models/Paciente');
const ConsultaProcedimento = require('./db/models/ConsultaProcedimento');
const Endereco = require('./db/models/Endereco');

async function backend() {
  await dbInit();
  await initListener();

  createListener('consulta.getById', async (consultaId) => {
    const consulta = await Consulta.findByPk(consultaId);
    return consulta.toJSON();
  });

  createListener('consulta.findAll', async (find) => {
    const consultas = await Consulta.findAll(find);

    return consultas.map((c) => c.toJSON());
  });

  createListener('consulta.findByDate', async (date) => {
    const asDate = new Date(date);
    const start = moment(asDate).startOf('day').toDate();
    const end = moment(asDate).endOf('day').toDate();

    const consultas = await Consulta.findAll({
      where: {
        data: {
          [Op.between]: [start, end],
        },
      },
    });

    return consultas.map((c) => c.toJSON());
  });

  createListener('consulta.updateStatus', async ({ consultaId, status }) => {
    const consulta = await Consulta.findByPk(consultaId);

    if (!consulta) return false;

    consulta.setDataValue('status', status);

    try {
      await consulta.save();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  });

  createListener('consulta.save', async (c) => {
    const consulta = c.id ? await Consulta.findByPk(c.id) : Consulta.build();
    consulta.set(c);
    const { id } = await consulta.save();
    return id;
  });

  createListener('consulta.delById', async (consultaId) => {
    const consulta = await Consulta.findByPk(consultaId);

    if (consulta) {
      const procedimentos = await ConsultaProcedimento.findAll({
        where: {
          consultaId,
        },
      });

      await Promise.all(procedimentos.map(async (p) => p.destroy()));

      await consulta.destroy();
    }

    return true;
  });

  createListener('consultaProcedimento.findAll', async (find) => {
    const consultaProcedimentos = await ConsultaProcedimento.findAll(find);
    return consultaProcedimentos.map((c) => c.toJSON());
  });

  createListener('consultaProcedimento.save', async (p) => {
    const procedimento = p.id
      ? await ConsultaProcedimento.findByPk(p.id) : ConsultaProcedimento.build();
    procedimento.set(p);
    await procedimento.save();
    return true;
  });

  createListener('consultaProcedimento.destroy', async (p) => {
    const procedimento = p.id
      ? await ConsultaProcedimento.findByPk(p.id) : ConsultaProcedimento.build();
    procedimento.set(p);
    await procedimento.destroy();
    return true;
  });

  createListener('contato.getById', async (contatoId) => {
    const contato = await Contato.findByPk(contatoId);
    return contato.toJSON();
  });

  createListener('paciente.getById', async (pacienteId) => {
    const paciente = await Paciente.findByPk(pacienteId);
    return paciente.toJSON();
  });

  createListener('paciente.findAll', async (find) => {
    const pacientes = await Paciente.findAll(find);

    return pacientes.map((c) => c.toJSON());
  });

  createListener('paciente.findByName', async (nome) => {
    const pacientes = await Paciente.findAll({
      where: {
        nome: {
          [Op.iLike]: `%${nome}%`,
        },
      },
    });

    return pacientes.map((c) => c.toJSON());
  });

  createListener('paciente.saveAll', async ({ paciente: p, contato: c, endereco: e }) => {
    const paciente = p.id ? await Paciente.findByPk(p.id) : Paciente.build();
    paciente.set(p);

    if (e) {
      const endereco = e.id ? await Endereco.findByPk(e.id) : Endereco.build();
      endereco.set(e);
      await endereco.save();
      const enderecoId = endereco.getDataValue('id');
      paciente.setDataValue('enderecoId', enderecoId);
    }

    if (c) {
      const contato = c.id ? await Contato.findByPk(c.id) : Contato.build();
      contato.set(c);
      await contato.save();
      const contatoId = contato.getDataValue('id');
      paciente.setDataValue('contatoId', contatoId);
    }

    try {
      await paciente.save();
      return true;
    } catch (err) {
      return false;
    }
  });

  createListener('endereco.getById', async (enderecoId) => {
    const endereco = await Endereco.findByPk(enderecoId);

    return endereco.toJSON();
  });
}

backend();
