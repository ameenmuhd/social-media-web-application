import Box from '@mui/material/Box';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ChatState } from '../../Context/ChatProvider';
import BottomNavbar from '../BottomNavbar/BottomNavbar';
import ChatBox from '../Chats/ChatBox';
import MyChats from '../Chats/MyChats';
import SideDrawer from '../miscellaneous/SideDrawer';

function Chat() {
  const {user} = ChatState()
  const [fetchAgain, setFetchAgain] = useState(false);
  const navigate = useNavigate()
  const userData = useSelector((state1)=> state1.user.value);

  useEffect(() => {
    if (!sessionStorage.getItem("user")) {
      navigate("/login");
    }
  }, []);

  return (
    <div style={{width:"100%"}}>
      {userData && <SideDrawer/>}
      <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        height: "84vh",
        padding: "10px",
      }}
      >
      {userData && <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      {userData && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}

      </Box>
      <BottomNavbar/>
    </div>
  )
}

export default Chat
