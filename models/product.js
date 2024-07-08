const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Category = require('./category'); 

const Product = sequelize.define('Product', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.INTEGER, 
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  images: {
    type: DataTypes.STRING,
    allowNull: true
  },
}, {
  tableName: 'products',
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

Product.belongsTo(Category, { as: 'category', foreignKey: 'CategoryId' });

module.exports = Product;
