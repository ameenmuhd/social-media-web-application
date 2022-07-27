import { Box } from "@mui/material";
import React from "react";
import { ChatState } from "../../Context/ChatProvider";
import SingleChat from "./SingleChat";

function ChatBox({fetchAgain,setFetchAgain}) {
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  return (
    <Box
      sx={{
        display: { xs: selectedChat ? "flex" : "none", md: "flex" },
        flexDirection: "column",
        alignItems: "center",
        padding: "3px",
        background: "#38B2AC",
        width: { xs: "100%", md: "68%" },
        borderRadius: "10px",
        borderWidth: "1px",
      }}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
    </Box>
  );
}

export default ChatBox;
