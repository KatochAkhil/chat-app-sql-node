const Sequelize = require("sequelize");

const db = new Sequelize("new-chat-app", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = db;
