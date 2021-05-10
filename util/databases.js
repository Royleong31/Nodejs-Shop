const mysql = require("mysql2");
const Sequelize = require("sequelize");

require("dotenv").config();

const sequelize = new Sequelize(
  "node-complete",
  "root",
  process.env.DB_PASSWORD,
  {
    dialect: "mysql",
    host: "localhost",
  }
);

module.exports = sequelize;
