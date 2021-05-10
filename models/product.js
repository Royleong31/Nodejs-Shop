const Sequelize = require("sequelize");
const sequelize = require("../util/databases");

const Product = sequelize.define("product", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  title: Sequelize.STRING, // can be js object or just the type

  price: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },

  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Product;
