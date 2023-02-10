const Sequelize = require("sequelize");
const db = require("../config");

const { DataTypes } = Sequelize;

const ConversationModal = db.define(
  "conversation",
  {
    reciverId: DataTypes.STRING,
    senderId: DataTypes.STRING,
  },
  {
    freezeTableName: true,
  }
);

(async () => {
  await db.sync();
})();

module.exports = ConversationModal;
