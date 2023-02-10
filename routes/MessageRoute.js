const express = require("express");
const router = express.Router();
const { Op, where } = require("sequelize");
const ConversationModal = require("../db/models/conversation");
const MessageModal = require("../db/models/Messagemodal");

// first create conversation
// then create message based on conversations

//Create Conversations

router.post("/createConversations", async (req, res) => {
  const newConversation = await ConversationModal.create(req.body);
  res.status(201).json(newConversation);
});
//Get Conversations

router.get("/getConversations/:id", async (req, res) => {
  const { id } = req.params;
  const getConversation = await ConversationModal.findOne({
    where: {
      id: id,
    },
  });
  if (!id) {
    res.status(404).json("No Status Found");
  } else {
    res.status(200).json();
  }
});

router.post("/add", async (req, res) => {
  try {
    const { text, sender, reciver, users } = req.body;

    const data = await MessageModal.create({
      text,
      sender,
      reciver,
      users,
    });
    if (data) {
      return res.json({ msg: "Message Sent" });
    } else {
      return res.json({ msg: "Message sent Failed" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/get", async (req, res) => {
  const { from, to } = req.body;
  const messages = await MessageModal.findAll({
    where: {
      users: [from, to],
    },
  });

  const projectedMessages = messages.map((msg) => {
    return {
      id: msg.id,
      fromSelf: msg.sender.toString() === from.toString(),
      message: msg.text,
      from: msg.sender,
    };
  });
  res.json(projectedMessages);
});

module.exports = router;
