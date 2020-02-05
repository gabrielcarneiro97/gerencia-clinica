/* eslint-disable @typescript-eslint/no-var-requires */

const { Sequelize } = require('sequelize');
// const sqlite3 = require('sqlite3');

const { dbPath } = require('../../master');

const sequelize = new Sequelize(
  'clinica', // db
  'postgres', // login
  '123456', // senha
  {
    dialect: 'sqlite',
    // dialectModule: sqlite3,
    storage: dbPath,
    logging: false,
  },
);

module.exports = sequelize;
