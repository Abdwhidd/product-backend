const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Category = sequelize.define('Category', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
}, {
    tableName: 'categories',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

module.exports = Category;