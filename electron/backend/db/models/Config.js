/* eslint-disable @typescript-eslint/no-var-requires */

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../connect');

class Config extends Model {
  static async getAll() {
    const dbData = await Config.findAll();

    return dbData.reduce((acc, crr) => ({ ...acc, [crr.varName]: crr.val }), {});
  }

  static async saveConfigs(configs) {
    const dbData = await this.getAll();

    const newConfigs = { ...dbData, ...configs };

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
