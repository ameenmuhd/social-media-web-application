// import React, { useState, useEffec, useRef, useEffect } from "react";
// import axios from "axios";
// import styled from "styled-components";
// import { useNavigate } from "react-router-dom";
// import Contacts from "../ChatComponents/Contacts";
// import Welcome from "../ChatComponents/Welcome";
// import ChatContainer from "../ChatComponents/ChatContainer";
// import { io } from "socket.io-client";
// import BottomNavbar from "../BottomNavbar/BottomNavbar";

// function Chat() {
//   const host = "http://localhost:5000";
//   const socket = useRef();
//   const [contacts, setContacts] = useState([]);
//   const [currentUser, setCurrentUser] = useState(undefined);
//   const [currentChat, setCurrentChat] = useState(undefined);
//   const [isLoaded, setIsLoaded] = useState(false);
//   const [onlineUsers,setOnlineUsers] = useState([]);
//   console.log('asa',onlineUsers);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!sessionStorage.getItem("user")) {
//       navigate("/login");
//     } else {
//       setCurrentUser(JSON.parse(sessionStorage.getItem("user")));
//       setIsLoaded(true);
//     }
//   }, []);

//   // useEffect(()=>{
//   //   socket.current = io(host);
//   // },[])

//   useEffect(() => {
//     if (currentUser) {
//       socket.current = io(host);
//       socket.current.emit("add-user", currentUser._id);
//       socket.current.on('getUsers',users=>{
//         // console.log(users);
//         setOnlineUsers(users)
//       })
//     }
//   }, [currentUser]);

//   useEffect(() => {
//     const fetchContacts = async () => {
//       try {
//         if (currentUser) {
//           const data = await axios.get(`/chatcontacts/${currentUser._id}`, {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: "Bearer " + sessionStorage.getItem("jwt"),
//             },
//           });
//           setContacts(data.data.following);
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     fetchContacts();
//   }, [currentUser]);

//   const handleChatChange = (chat) => {
//     setCurrentChat(chat);
//   };

//   return (
//     <>
//       <Container>
//         <div className="container">
//           <Contacts
//             contacts={contacts}
//             currentUser={currentUser}
//             onlineUsers={onlineUsers}
//             changeChat={handleChatChange}
//           />
//           {isLoaded && currentChat === undefined ? (
//             <Welcome currentUser={currentUser} />
//           ) : (
//             <ChatContainer
//               currentChat={currentChat}
//               currentUser={currentUser}
//               socket={socket}
//             />
//           )}
//         </div>
//       </Container>
//       <BottomNavbar ChangeColor1={true} />
//     </>
//   );
// }

// const Container = styled.div`
//   height: 100%;
//   width: 100%;
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   gap: 1rem;
//   align-items: center;
//   background-color: #F2F5F9;
//   .container {
//     height: 93vh;
//     width: 100%;
//     background-color: #F2F5F9;
//     display: grid;
//     grid-template-columns: 25% 75%;
//     @media screen and (min-width: 360px) and (max-width: 480px) {
//       grid-template-columns: 35% 65%;
//     }
//   }
// `;

// export default Chat;


import Box from '@mui/material/Box';
import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../App';
import { ChatState } from '../../Context/ChatProvider';
import ChatBox from '../Chats/ChatBox';
import MyChats from '../Chats/MyChats';
import SideDrawer from '../miscellaneous/SideDrawer';

function Chat() {
  // const { state, dispatch } = useContext(UserContext);
  const {user} = ChatState()
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div style={{width:"100%"}}>
      {user && <SideDrawer/>}
      <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        height: "91.5vh",
        padding: "10px"
      }}
      >
      {user && <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}

      </Box>
    </div>
  )
}

export default Chat
