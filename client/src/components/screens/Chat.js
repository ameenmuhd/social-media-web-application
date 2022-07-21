import React, { useState, useEffec, useRef, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Contacts from "../ChatComponents/Contacts";
import Welcome from "../ChatComponents/Welcome";
import ChatContainer from "../ChatComponents/ChatContainer";
import {io} from 'socket.io-client'

function Chat() {
  const host = 'http://localhost:5000';
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [isLoaded,setIsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionStorage.getItem("user")) {
      navigate("/login");
    } else {
      setCurrentUser(JSON.parse(sessionStorage.getItem("user")));
      setIsLoaded(true)
    }
  }, []);

  useEffect(()=>{
    if(currentUser){
      socket.current = io(host);
      socket.current.emit('add-user', currentUser._id)
    }
  },[currentUser])

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        if (currentUser) {
          const data = await axios.get(`/chatcontacts/${currentUser._id}`,{
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + sessionStorage.getItem("jwt")
          }
          });
          setContacts(data.data.following);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchContacts();
  }, [currentUser]);

  const handleChatChange = (chat) =>{
    setCurrentChat(chat)
  }

  return (
    <Container>
      <div className="container">
      <Contacts contacts = {contacts} currentUser = {currentUser} changeChat = {handleChatChange}/>
      {
        isLoaded && currentChat === undefined ?
        <Welcome currentUser = {currentUser}/> :
        <ChatContainer currentChat = {currentChat} currentUser = {currentUser} socket={socket}/>
      }
      </div>
    </Container>
  );
}

const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 100%;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 360px) and (max-width: 480px){
      grid-template-columns: 35% 65%;
    }
  }
`;

export default Chat;