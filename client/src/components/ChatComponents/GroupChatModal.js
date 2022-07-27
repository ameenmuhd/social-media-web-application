import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import { FormControl, InputLabel, OutlinedInput } from "@mui/material";
import axios from "axios";
import UserListItem from "../UserListItem/UserListItem";
import M from "materialize-css";
import UserBadgeItem from "../UserListItem/UserBadgeItem";
import { ChatState } from "../../Context/ChatProvider";

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

export default function GroupChatModal({ children }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  

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
  }
  
  const handleSubmit = async () => {
    if(!groupChatName || !selectedUsers){
        return M.toast({ html: "please fill all the fields", classes: "#ef5350 red lighten-1" });
    }
    try {
        const {data} = await axios.post('/creategroup',{
            name: groupChatName,
            users: JSON.stringify(selectedUsers.map((u)=>u._id))
        }, {
            headers: {
              Authorization: "Bearer " + sessionStorage.getItem("jwt"),
            },
          });
          setChats([data,...chats])
          handleClose()
          setSelectedUsers([])
          setSearchResult([])
          return M.toast({
            html: "Group Created",
            classes: "#00e676 green accent-3",
          });
    } catch (error) {
     console.log(error);   
    }
  }
  
  const handleDelete = (delUser) => {
    setSelectedUsers(
        selectedUsers.filter((sel) => sel._id !== delUser._id)
        )
  }
  
  const handleGroup = (userToAdd) => {
    if(selectedUsers.includes(userToAdd)){
        return M.toast({ html: "User already selected", classes: "#ef5350 red lighten-1" });
    }
    setSelectedUsers([...selectedUsers,userToAdd])
  }

  return (
    <div>
      <span onClick={handleOpen} onClose={()=>{handleClose}}>{children}</span>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Create group chat
          </Typography>
          <div
            id="modal-modal-description"
            sx={{
              mt: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <FormControl>
              <input
                id="component-outlined"
                onChange={(e)=>setGroupChatName(e.target.value)}
                placeholder="Group Name"
              />
            </FormControl>
            <FormControl style={{marginTop: "8px"}}>
              <input
                id="component-outlined"
                placeholder="Search Users"
                onChange={(e)=>handleSearch(e.target.value)}
              />
            </FormControl>

            {selectedUsers?.map((u)=>{
                return(
                    <UserBadgeItem key={u._id} user={u} handleFunction={()=>handleDelete(u)}/>
                )
            })}

            {loading ? <div>loading...</div> : 
                searchResult?.slice(0,4).map((user)=>{
                    return(
                        <UserListItem key={user._id} user={user} handleFunction={()=>handleGroup(user)}/>
                    )
                })
            }
          </div>
          <Button variant="outlined" onClick={handleSubmit} style={{right:"0px",marginTop:"10px"}}>Create Group</Button>
        </Box>
      </Modal>
    </div>
  );
}
