/* eslint-disable @typescript-eslint/no-var-requires */

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  'clinica', // db
  'postgres', // login
  '123456', // senha
  {
    host: 'localhost',
    dialect: 'postgres',
    logging: false,
  },
);

module.exports = sequelize;
