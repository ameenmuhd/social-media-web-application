const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const Post = mongoose.model("Post");
const User = mongoose.model("User");
// const Chat = mongoose.model("Chat");
const ChatModel = mongoose.model("ChatModel");
const Message = mongoose.model("Message");

router.post('/personalchat',requireLogin,async (req,res)=>{
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  var isChat = await ChatModel.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await ChatModel.create(chatData);
      const FullChat = await ChatModel.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
})

router.get('/fetchchat',requireLogin,async (req,res)=>{
  try {
    ChatModel.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
})

router.post("/creategroup", requireLogin, async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the feilds" });
  }

  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }
  users.push(req.user);

  try {
    const groupChat = await ChatModel.create({
        chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    })

    const fullGroupChat = await ChatModel.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    throw new Error(error.message);
  }
});

router.put("/renamegroup", requireLogin, async (req, res) => {
    try { 
        const {chatId,chatName} = req.body
    
        const updatedChat = await ChatModel.findByIdAndUpdate(
            chatId,
            {
                chatName
            },{
                new:true
            }
        ).populate("users", "-password")
        .populate("groupAdmin", "-password");
        res.json(updatedChat)
    } catch (error) {
    throw new Error(error.message);
    }
  
});

router.put("/addtogroup", requireLogin, async (req, res) => {
    try { 
        const {chatId,userId} = req.body
    
        const added = await ChatModel.findByIdAndUpdate(
            chatId,
            {
              $push: { users: userId },
            },
            {
              new: true,
            }
          )
            .populate("users", "-password")
            .populate("groupAdmin", "-password");
            res.json(added)
    } catch (error) {
    throw new Error(error.message);
    }
});

router.put("/removefromgroup", requireLogin, async (req, res) => {
    try { 
        const {chatId,userId} = req.body
    
        const added = await ChatModel.findByIdAndUpdate(
            chatId,
            {
              $pull: { users: userId },
            },
            {
              new: true,
            }
          )
            .populate("users", "-password")
            .populate("groupAdmin", "-password");
            res.json(added)
    } catch (error) {
    throw new Error(error.message);
    }
});

router.post('/sendmessage',requireLogin,async (req,res)=>{
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic")
    message = await message.populate("chat")
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await ChatModel.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
})

router.get('/getmessages/:chatId',requireLogin,async (req,res)=>{
  try {
    console.log(req.params.chatId);
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
})



module.exports = router;
