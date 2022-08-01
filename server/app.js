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
require("./models/product");
require("./models/chatModel");
require("./models/messageModel");
require("./models/category");

app.use(express.json());
app.use(cors());

app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));
app.use(require("./routes/chat"));
app.use(require("./routes/admin"));
app.use(require("./routes/marketplace"));

const server = app.listen(PORT, () => {
  console.log("server is running on", PORT);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});