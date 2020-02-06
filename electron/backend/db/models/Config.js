/* eslint-disable @typescript-eslint/no-var-requires */

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../connect');

class Config extends Model {
  static async getAll() {
    const db = await Config.findAll();

    return db.reduce((acc, crr) => ({ ...acc, [crr.varName]: crr.val }), {});
  }

  static async saveConfigs(configs) {
    const onDb = await this.getAll();

    const newConfigs = { ...onDb, ...configs };

    const promises = Object.keys(newConfigs).map(async (varName) => {
      const val = newConfigs[varName];
      const config = Config.build({ varName, val });
      return config.save();
    });

    return Promise.all(promises);
  }
}

Config.init({
  varName: {
    type: new DataTypes.STRING(),
    primaryKey: true,
  },
  val: new DataTypes.STRING(),
}, {
  tableName: 'configs',
  modelName: 'config',
  sequelize,
});

module.exports = Config;
