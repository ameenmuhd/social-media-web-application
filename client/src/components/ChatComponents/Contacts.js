import Avatar from "@mui/joy/Avatar";
import IconButton from "@mui/joy/IconButton";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import CircleIcon from "@mui/icons-material/Circle";
import { width } from "@mui/system";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import GroupChatModal from "./GroupChatModal";

function Contacts({ contacts, currentUser, changeChat, onlineUsers }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  console.log("dsa", onlineUsers, contacts);

  useEffect(() => {
    if (currentUser) {
      setCurrentUserImage(currentUser.pic);
      setCurrentUserName(currentUser.name);
    }
  }, [currentUser]);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  return (
    <>
      {currentUserImage && currentUserName && (
        <Container>
          <div className="brand brand-logo">
            <Link to="/">
              <p style={{ fontSize: "2.2rem" }}>Logo</p>
            </Link>
          <div>
            <GroupChatModal>

            <Button variant="contained" endIcon={<AddIcon />}>
              create group
            </Button>
            </GroupChatModal>
          </div>
          </div>
          <div className="contacts">
            {contacts.map((contact, index) => {
              return (
                <div
                  className={`contact ${
                    index === currentSelected ? "selected" : ""
                  }`}
                  key={index}
                  onClick={() => changeCurrentChat(index, contact)}
                >
                  <div className="avatar">
                    <IconButton sx={{ p: 0 }}>
                      <Avatar size="md" alt="Remy Sharp" src={contact.pic} />
                    </IconButton>
                  </div>
                  <div className="username">
                    <h3>{contact.name}</h3>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "flex-end",
                      width: "16rem",
                    }}
                  >
                    {onlineUsers.map((online) => {
                      {
                        contact._id && online._id && (
                          <CircleIcon
                            size="sm"
                            sx={{
                              color: "#7CFC00",
                              marginTop: "1px",
                              fontSize: "1.3rem",
                            }}
                          />
                        );
                      }
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="current-user">
            <div className="avatar">
              <IconButton sx={{ p: 0 }}>
                <Avatar size="md" alt="Remy Sharp" src={currentUserImage} />
              </IconButton>
            </div>
            <div className="username">
              <h2>{currentUserName}</h2>
            </div>
          </div>
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  background-color: #fff;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    background-color: #f8f8f8;
    h3 {
      color: black;
      text-transform: uppercase;
      font-size: 20px;
    }
  }
  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.5rem;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .contact {
      background-color: #ffffff34;
      min-height: 5rem;
      cursor: pointer;
      width: 90%;
      border-bottom: 1px solid #f1f1f1;
      padding: 0.4rem;
      display: flex;
      gap: 0.6rem;
      align-items: center;
      transition: 0.5s ease-in-out;
      .avatar {
        img {
        }
      }
      .username {
        h3 {
          font-size: 1rem;
          margin-bottom: 30px;
        }
      }
    }
    .selected {
      background-color: #f0f2f5;
    }
  }
  .current-user {
    background-color: #f8f8f8;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.8rem;
    .avatar {
      img {
      }
    }
    .username {
      h2 {
        font-size: 1rem;
        margin-bottom: 40px;
      }
    }
    @media screen and (min-width: 360px) and (max-width: 480px) {
      gap: 0rem;
      .username {
        h2 {
          font-size: 1rem;
          margin-bottom: 30px;
        }
      }
    }
  }
`;

export default Contacts;
