import { Avatar, Tooltip } from "@mui/material";
import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from "../../config/ChatLogics";
import { ChatState } from "../../Context/ChatProvider";
import { useSelector } from "react-redux";

const ScrollableChat = ({ messages }) => {
    const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();
    const userData = useSelector((state1)=> state1.user.value)
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) =>{return (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, userData._id) ||
              isLastMessage(messages, i, userData._id)) && (
                <Tooltip title={m.sender.name} arrow>
                <Avatar alt="Cindy Baker" src={m.sender.pic} />
                </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === userData._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, userData._id),
                marginTop: isSameUser(messages, m, i, userData._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {m.content}
            </span>
          </div>
        )})}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
