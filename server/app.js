const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = 5000;
const { MONGO_URL } = require("./keys");
const cors = require("cors");
const socket = require("socket.io");

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
  console.log("connected to database");
});
mongoose.connection.on("error", (err) => {
  console.log("Error connecting database", err);
});

require("./models/user");
require("./models/post");
require("./models/chat");

app.use(express.json());
app.use(cors());

app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));
app.use(require("./routes/chat"));
app.use(require("./routes/admin"));

const server = app.listen(PORT, () => {
  console.log("server is running on", PORT);
});

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    Credential: true,
  },
});

global.onlineUsers = new Map();

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

io.on("connection", (socket) => {
  console.log("user connected");
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });
  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.message);
    }
  });
  socket.on("disconnect", () => {
    console.log("disconnected");
    removeUser(socket.id)
    io.emit("getUsers", users);
  });
});
