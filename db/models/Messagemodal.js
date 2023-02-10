const Sequelize = require("sequelize");
const db = require("../config");

const { DataTypes } = Sequelize;

const MessageModal = db.define(
  "messages",
  {
    text: DataTypes.STRING,
    reciver: DataTypes.STRING,
    users: {
      type: DataTypes.STRING,
      allowNull: false,
      get() {
        return this.getDataValue("users").split(";");
      },
      set(val) {
        this.setDataValue("users", val.join(";"));
      },
    },
    sender: DataTypes.STRING,
    conversationId: DataTypes.STRING,
  },
  {
    freezeTableName: true,
  }
);

(async () => {
  await db.sync();
})();

module.exports = MessageModal;
