const { DataTypes } = require('sequelize');
const sequelize = require('../db/db'); // Import sequelize connection

const Setting = sequelize.define('Setting', {
  maintanence_enabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  mails_enabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  }
});

module.exports = Setting;
