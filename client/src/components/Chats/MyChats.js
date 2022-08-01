import React, { useEffect, useState } from "react";
import M from "materialize-css";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import { Box, Button, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { getSender, getSenderPic } from "../../config/ChatLogics";
import GroupChatModal from "./GroupChatModal";
import Typography from "@mui/joy/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";

function MyChats({ fetchAgain }) {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const fetchChats = async () => {
    try {
      const { data } = await axios.get("/fetchchat", {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("jwt"),
        },
      });
      setChats(data);
    } catch (error) {
      console.log(error);
      M.toast({
        html: "some error occured",
        classes: "#ef5350 red lighten-1",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(sessionStorage.getItem("user")));
    // setSelectedChat("")
    fetchChats();
  }, [fetchAgain]);

  return (
    <>
      {loggedUser ? (
        <Box
          sx={{
            display: { xs: selectedChat ? "none" : "flex", md: "flex" },
            flexDirection: "column",
            alignItems: "center",
            padding: "3px",
            background: "white",
            width: { xs: "100%", md: "31%" },
            borderRadius: "10px",
            borderWidth: "1px",
          }}
        >
          <Box
            className="heading-chat"
            sx={{
              paddingBottom: "3px",
              paddingX: "3px",
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography fontSize={30}>My chats</Typography>
            <GroupChatModal>
              <Button variant="contained" endIcon={<AddIcon />}>
                Create Group
              </Button>
            </GroupChatModal>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              padding: "3px",
              backgroundColor: "#F8F8F8",
              width: "100%",
              height: "100%",
              borderRadius: "10px",
              msOverflowY: "hidden",
            }}
          >
            {chats ? (
              <Stack
                sx={{
                  overflowY: "scroll",
                }}
              >
                {chats.map((chat) => {
                  return (
                    <Box
                      onClick={() => setSelectedChat(chat)}
                      sx={{
                        cursor: "pointer",
                        // background:
                        //   selectedChat === chat ? "#38B2AC" : "E8E8E8",
                        // color: selectedChat === chat ? "white" : "black",
                        paddingX: "3px",
                        paddingY: "2px",
                        borderRadius: "10px",
                        borderBottom: "1px solid #f1f1f1",
                      }}
                      key={chat._id}
                    >
                      <List
                        dense
                        sx={{
                          width: "100%",
                          bgcolor: "background.paper",
                          background:
                            selectedChat === chat ? "#38B2AC" : "E8E8E8",
                        }}
                      >
                        <ListItem>
                          {/* <ListItemButton> */}
                            <ListItemAvatar>
                              <Avatar
                                alt="G"
                                src={
                                  !chat.isGroupChat
                                    ? getSenderPic(loggedUser, chat.users)
                                    : chat.chatName
                                }
                              />
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                !chat.isGroupChat
                                  ? getSender(loggedUser, chat.users)
                                  : chat.chatName
                              }
                            />
                          {/* </ListItemButton> */}
                        </ListItem>
                      </List>
                    </Box>
                  );
                })}
              </Stack>
            ) : (
              <h3>Loading...</h3>
            )}
          </Box>
        </Box>
      ) : (
        <div>Loading....</div>
      )}
    </>
  );
}

export default MyChats;
