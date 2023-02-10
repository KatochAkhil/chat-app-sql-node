const express = require("express");
const doetenv = require("dotenv");
const cors = require("cors");
const socket = require("socket.io");
const authRoute = require("./routes/Userroute");
const messageRoute = require("./routes/MessageRoute");
doetenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoute);
app.use("/api/messages", messageRoute);

const server = app.listen(process.env.PORT, () => {
  console.log(`App is working on Port No ${process.env.PORT}`);
});

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.message);
    }
  });
});
