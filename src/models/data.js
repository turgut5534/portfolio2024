const { DataTypes } = require('sequelize');
const sequelize = require('../db/db'); // Import sequelize connection

const Visitor = sequelize.define('Visitor', {
  ip: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  device: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  os: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  browser: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  language: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  referrer: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  utmSource: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Visitor;
