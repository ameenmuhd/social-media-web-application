import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/joy/IconButton";
import UserBadgeItem from "../UserListItem/UserBadgeItem";
import { FormControl } from "@mui/material";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import UserListItem from "../UserListItem/UserListItem";
import InfoIcon from '@mui/icons-material/Info';

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const UpdateGroupChat = ({ fetchAgain, setFetchAgain,fetchMessages }) => {
  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () =>{
    setOpen(false);
    setSearchResult([])
  } 
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
        
        return;
      }
  
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("jwt"),
          },
        };
        const { data } = await axios.put(
          `/removefromgroup`,
          {
            chatId: selectedChat._id,
            userId: user1._id,
          },
          config
        );
  
        user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        fetchMessages();
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
      setGroupChatName("");
  };

  const handleRename = async () => {
    if (!groupChatName) {
      return M.toast({
        html: "please add name",
        classes: "#ef5350 red lighten-1",
      });
    }
    try {
      setRenameLoading(true);
      const { data } = await axios.put(
        "/renamegroup",
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("jwt"),
          },
        }
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      console.log(error);
      return M.toast({
        html: "some error occured",
        classes: "#ef5350 red lighten-1",
      });
      setRenameLoading(false)
    }
    setGroupChatName("");
  };

  const handleSearch = async (query) => {
    setSearch(query)
        if(!query){
            return;
        }
        try {
            setLoading(true)

            const {data} = await axios.get(`/search-users-chat?search=${search}`, {
                headers: {
                  Authorization: "Bearer " + sessionStorage.getItem("jwt"),
                },
              });
              setLoading(false)
              setSearchResult(data)

        } catch (error) {
            console.log('aas',error);
        }
  };

  const handleAddUser  = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
        return M.toast({
            html: "User Already Added",
            classes: "#ef5350 red lighten-1",
          });
      }
      if (selectedChat.groupAdmin._id !== user._id) {
        return M.toast({
            html: "Only admins can add someone!",
            classes: "#ef5350 red lighten-1",
          });
      }
      try {
        setLoading(true)
        const {data} = await axios.put('/addtogroup',{
            chatId: selectedChat._id,
          userId: user1._id,
        } ,{
            headers: {
              Authorization: "Bearer " + sessionStorage.getItem("jwt"),
            },
          });
          setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
      } catch (error) {
        console.log(error);
      }
  
  
    }



  return (
    <div>
      <IconButton onClick={handleOpen}>
        <InfoIcon />
      </IconButton>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{
              fontSize: "35px",
              fontFamily: "sans-serif",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {selectedChat.chatName}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexWrap: "wrap",
                paddingBottom: "3px",
              }}
            >
              {selectedChat.users.map((u) => {
                return (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleRemove(u)}
                  />
                );
              })}
            </Box>
            <div sx={{ display: "flex" }}>
              <input
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
                placeholder="Group Name"
              />
              <LoadingButton
                loading={renameloading}
                loadingPosition="start"
                startIcon={<SaveIcon />}
                variant="outlined"
                sx={{ marginLeft: "3px" }}
                onClick={handleRename}
              >
                Save
              </LoadingButton>
            </div>
            <FormControl style={{ marginTop: "2px" }}>
              <input
                id="component-outlined"
                placeholder="Add Users to Group"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? <div>loading...</div> : 
                searchResult?.slice(0,4).map((user)=>{
                    return(
                        <UserListItem key={user._id} user={user} handleFunction={()=>handleAddUser(user)}/>
                    )
                })
            }
          </Typography>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button sx={{ marginTop: "5px" }} variant="outlined" color="error" onClick={() => handleRemove(user)}>
              Leave
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default UpdateGroupChat;
