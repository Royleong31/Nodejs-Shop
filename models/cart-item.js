const Sequelize = require("sequelize");
const sequelize = require("../util/databases");

const CartItem = sequelize.define("cart-item", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  quality: Sequelize.INTEGER
});

module.exports = CartItem;
