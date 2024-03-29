import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import { Link, useNavigate } from "react-router-dom";
import M from "materialize-css";
import AspectRatio from "@mui/joy/AspectRatio";
import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import CardOverflow from "@mui/joy/CardOverflow";
import IconButton from "@mui/joy/IconButton";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";
import { format } from "timeago.js";
import { styled, alpha } from "@mui/material/styles";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import EditIcon from "@mui/icons-material/Edit";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Navbar from "../Navbar/Navbar";
import BottomNavbar from "../BottomNavbar/BottomNavbar";

function Home() {
  const [comment, showComment] = useState(false);
  const [postId, setCommentId] = useState("");
  const [data, setData] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionStorage.getItem("user")) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    fetch("/getsubpost", {
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setData(result.posts);
      });
  }, []);

  const likePost = (id) => {
    fetch("/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        //console.log(result);
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const unlikePost = (id) => {
    fetch("/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const makeComment = (text, postId) => {
    fetch("/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId,
        text,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteComment = (postId, commentId) => {
    fetch(`/deletecomment/${postId}/${commentId}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result._id) {
            result.postedBy = item.postedBy;
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
        M.toast({
          html: "comment deleted successfully",
          classes: "#00e676 green accent-3",
        });
      });
  };

  const handleShowComment = (postId) => {
    setCommentId(postId);
    comment ? showComment(false) : showComment(true);
  };

  return (
    <>
      <Navbar />
      <div className="home">
        {data.map((item) => {
          return (
            <div className="card home-card" key={item._id}>
              <Card
                variant="outlined"
                sx={{
                  minWidth: 300,
                  "--Card-radius": (theme) => theme.vars.radius.xs,
                  borderColor: "white",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    pb: 1.5,
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      "&:before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        m: "-2px",
                      },
                    }}
                  >
                    <IconButton sx={{ p: 0 }}>
                      <Avatar
                        size="sm"
                        alt="Remy Sharp"
                        src={item.postedBy.pic}
                      />
                    </IconButton>
                  </Box>
                  <Typography fontWeight="lg">
                    <Link
                      to={
                        item.postedBy._id !== state._id
                          ? "/profile/" + item.postedBy._id
                          : "/profile"
                      }
                    >
                      {item.postedBy.name}
                    </Link>
                  </Typography>
                  <IconButton
                    variant="plain"
                    color="neutral"
                    size="sm"
                    sx={{ ml: "auto" }}
                  ></IconButton>
                  {item.postedBy._id === state._id ? (
                    <>
                      <Link to={`/editpost/${item._id}`}>
                        <MenuItem onClick={handleClose} disableRipple>
                          <EditIcon />
                        </MenuItem>
                      </Link>
                      <MenuItem
                        onClick={() => {
                          swal({
                            title: "Are you sure to delete post?",
                            icon: "warning",
                            buttons: true,
                            dangerMode: true,
                          }).then((willDelete) => {
                            if (willDelete) {
                              deletPost(item._id);
                              swal("Your post has been deleted!", {
                                icon: "success",
                              });
                            }
                          });
                        }}
                        disableRipple
                      >
                        <DeleteForeverIcon />
                      </MenuItem>
                    </>
                  ) : (
                    ""
                  )}
                </Box>
                <CardOverflow>
                  <AspectRatio>
                    <img src={item.photo} alt="" />
                  </AspectRatio>
                </CardOverflow>
                <Box
                  sx={{ display: "flex", alignItems: "center", mx: -1, my: 1 }}
                >
                  <Box sx={{ width: 0, display: "flex", gap: 0.5 }}>
                    {item.likes.includes(state._id) ? (
                      <i
                        className="material-icons"
                        onClick={() => {
                          unlikePost(item._id);
                        }}
                        style={{ color: "red" }}
                      >
                        favorite
                      </i>
                    ) : (
                      <i
                        className="material-icons"
                        onClick={() => {
                          likePost(item._id);
                        }}
                      >
                        favorite_border
                      </i>
                    )}
                    <>
                      {/* <CommentModal postId = {item}> */}
                      <i
                        style={{ marginRight: "-24px" }}
                        className="material-icons"
                        onClick={() => {
                          handleShowComment(item._id);
                        }}
                        >
                        comments
                      </i>
                        {/* </CommentModal> */}
                      <Typography fontWeight="lg" level="h4">
                        {item.comments.length}
                      </Typography>
                    </>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      mx: "auto",
                    }}
                  >
                    {[...Array(5)].map((_, index) => (
                      <Box
                        key={index}
                        sx={{
                          borderRadius: "50%",
                          width: `max(${6 - index}px, 3px)`,
                          height: `max(${6 - index}px, 3px)`,
                          bgcolor:
                            index === 0
                              ? "primary.solidBg"
                              : "background.level3",
                        }}
                      />
                    ))}
                  </Box>
                </Box>
                <Link
                  to="/"
                  component="button"
                  underline="none"
                  fontSize="sm"
                  fontWeight="lg"
                  textColor="text.primary"
                >
                  {item.likes.length} Likes
                </Link>
                <Typography fontSize="sm">
                  <Link
                    to={
                      item.postedBy._id !== state._id
                        ? "/profile/" + item.postedBy._id
                        : "/profile"
                    }
                    style={{
                      fontWeight: "500",
                      fontSize: "15px",
                      marginRight: "5px",
                    }}
                  >
                    {item.postedBy.name}
                  </Link>{" "}
                  {item.title}
                </Typography>

                <CardOverflow sx={{ p: "var(--Card-padding)" }}>
                  {postId === item._id && comment ? (
                    <>
                      <Typography
                        fontSize="lg"
                        justifyContent="center"
                        fontWeight="lg"
                        lineHeight={0}
                      >
                        comments
                      </Typography>
                      
                      <Box 
                      sx={{
                        height:"100px",
                        overflowY:"scroll",
                        justifyContent:"space-between"
                      }}
                      >
            
                      {item.comments.length !== 0 ? item.comments.map((record) => {
                        return (
                          <h6 key={record._id}>
                            <span
                              style={{ fontWeight: "500", fontSize: "14px" }}
                            >
                              {record.postedBy.name}
                            </span>{" "}
                            {record.text}{" "}
                            {record.postedBy._id === state._id && (
                              <i
                              className="material-icons"
                                style={{ fontSize: "12px",display:"inline-flex",justifyContent:'end' }}
                                onClick={() => {
                                  swal({
                                    title: "Are you sure to delete comment?",
                                    icon: "warning",
                                    buttons: true,
                                    dangerMode: true,
                                  }).then((willDelete) => {
                                    if (willDelete) {
                                      deleteComment(item._id, record._id);
                                      swal("Your comment has been deleted!", {
                                        icon: "success",
                                      });
                                    }
                                  });
                                }}
                                >
                                delete
                              </i>
                            )}
                          </h6>
                        );
                      }) : <div style={{
                        marginTop: '50px'
                      }}>no comments</div>}
                      </Box>
                    </>
                  ) : null}

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      makeComment(e.target[0].value, item._id);
                    }}
                  >
                    <Input
                      variant="plain"
                      size="sm"
                      placeholder="Add a comment…"
                      sx={{
                        flexGrow: 1,
                        mr: 1,
                        "--Input-focusedThickness": "0px",
                      }}
                    />
                  </form>

                  <p style={{ fontSize: "10px", color: "text.tertiary" }}>
                    {format(item.createdAt)}
                  </p>
                </CardOverflow>
              </Card>
            </div>
          );
        })}
      </div>
      <BottomNavbar />
    </>
  );
}

export default Home;
