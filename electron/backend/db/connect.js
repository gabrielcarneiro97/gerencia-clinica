/* eslint-disable @typescript-eslint/no-var-requires */

const { Sequelize } = require('sequelize');
const sqlite3 = require('sqlite3');

const { dbPath } = require('../../master');

const { DB_NAME, DB_USER, DB_PASSWORD } = require('../../master.json');

const sequelize = new Sequelize(
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  {
    dialect: 'sqlite',
    dialectModule: sqlite3,
    storage: dbPath,
    // logging: false,
  },
);

module.exports = sequelize;
