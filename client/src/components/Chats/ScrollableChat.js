import { Avatar, Tooltip } from "@mui/material";
import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from "../../config/ChatLogics";
import { ChatState } from "../../Context/ChatProvider";
import Button from '@mui/material/Button';

const ScrollableChat = ({ messages }) => {
    const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) =>{return (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
                <Tooltip title={m.sender.name} arrow>
                <Avatar alt="Cindy Baker" src={m.sender.pic} />
                </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
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
