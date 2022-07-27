import { Box, IconButton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getSender } from "../../config/ChatLogics";
import UpdateGroupChat from "../miscellaneous/UpdateGroupChat";
import { Circles } from "react-loading-icons";
import FormControl from "@mui/material/FormControl";
import axios from "axios";
import M from "materialize-css";
import './styles.css'
import ScrollableChat from "./ScrollableChat";
import io from 'socket.io-client'
import Lottie, {} from 'react-lottie'
import animationData from '../../animations/12966-typing-indicator.json'
import Welcome from "../ChatComponents/Welcome";
import { Link } from "react-router-dom";

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

function SingleChat({ fetchAgain, setFetchAgain }) {
  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: sessionStorage.getItem("jwt"),
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/getmessages/${selectedChat._id}`,
        config
      );
      console.log(data);
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      M.toast({ html: "Error Occured", classes: "#ef5350 red lighten-1" });
    }
  };
  
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  console.log(notification,"asdasda");

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: sessionStorage.getItem("jwt"),
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/sendmessage",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        M.toast({ html: "Error Occured", classes: "#ef5350 red lighten-1" });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Typography
            variant="h4"
            component="h2"
            className="heading-chat"
            sx={{
              fontSize: { base: "28px", md: "30px" },
              paddingBottom: "3px",
              paddingX: "2px",
              width: "100%",
              display: "flex",
              justifyContent: { base: "space-between" },
              alignItems: "center",
            }}
          >
            <IconButton
              sx={{ display: { base: "flex", md: "none" } }}
              onClick={() => setSelectedChat("")}
            >
              <ArrowBackIcon />
            </IconButton>
            {!selectedChat.isGroupChat ? (
              <div>
                 <Link
                      to={
                       "/profile/" + selectedChat.users[1]._id
                      }
                    >
                {getSender(user, selectedChat.users)}
                    </Link>
                </div>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChat
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: "3px",
              background: "#E8E8E8",
              width: "100%",
              height: "100%",
              borderRadius: "10px",
              overflowY: "hidden",
            }}
          >
            {loading ? (
              <Circles
                height={"4rem"}
                fill={"#06bcee"}
                style={{
                  alignItems: "center",
                  margin: "auto",
                }}
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages = {messages}/>
              </div>
            )}
         
              <FormControl onKeyDown={sendMessage}>
                {istyping ? <div>
                  <Lottie
                  options={defaultOptions}
                  width={70}
                  style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div> : ""}

                <input id="my-input" placeholder="Enter your text" onChange={typingHandler} value={newMessage}/>
              </FormControl>
            </Box>
     
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Welcome currentUser={user.name}/>
        </Box>
      )}
    </>
  );
}

export default SingleChat;
