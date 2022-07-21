import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import { useNavigate, useParams } from "react-router-dom";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Audio } from "react-loader-spinner";

function UserProfile() {
  const [usersProfile, setProfile] = useState(null);
  const { state, dispatch } = useContext(UserContext);
  const { userId } = useParams();
  const [showfollow, setShowfollow] = useState(
    state ? !state.following.includes(userId) : true
  );
  const navigate = useNavigate()

  useEffect(() => {
    if (!sessionStorage.getItem("user")) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    fetch(`/user/${userId}`, {
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setProfile(result);
      });
  }, []);

  const followUser = () => {
    fetch("/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        sessionStorage.setItem("user", JSON.stringify(data));
        setProfile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, data._id],
            },
          };
        });
        setShowfollow(false);
      });
  };

  const unfollowUser = () => {
    fetch("/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        unfollowId: userId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        sessionStorage.setItem("user", JSON.stringify(data));
        setProfile((prevState) => {
          const newFollower = prevState.user.followers.filter(
            (item) => item !== data._id
          );
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: newFollower,
            },
          };
        });
        setShowfollow(true);
      });
  };

  return (
    <>
      {usersProfile ? (
        <div style={{ maxWidth: "550px", margin: "0px auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              margin: "18px 0px",
              borderBottom: "1px solid grey",
            }}
          >
            <div>
              <img
                src={usersProfile.user.pic}
                alt="no imag.."
                style={{
                  width: "160px",
                  height: "160px",
                  borderRadius: "80px",
                }}
              />
            </div>
            <div>
              <Typography component="div">
                <Box
                  sx={{
                    fontSize: 30,
                    m: 1,
                    fontWeight: "500",
                    textTransform: "capitalize",
                  }}
                >
                  {usersProfile.user.name}
                </Box>
                <Box
                  sx={{
                    fontSize: 15,
                    m: 1,
                    lineHeight: 1,
                    fontWeight: "light",
                  }}
                >
                  {usersProfile.user.email}
                </Box>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "108%",
                  }}
                >
                  <h6>{usersProfile.posts.length} posts</h6>
                  <h6>{usersProfile.user.followers.length} followers</h6>
                  <h6>{usersProfile.user.following.length} following</h6>
                </div>
              </Typography>
              {showfollow ? (
                <button
                  style={{ margin: "10px" }}
                  className="btn waves-effect waves-light #42a5f5 blue lighten-1"
                  onClick={() => followUser()}
                >
                  Follow
                </button>
              ) : (
                <button
                  style={{ margin: "10px" }}
                  className="btn waves-effect waves-light #42a5f5 blue lighten-1"
                  onClick={() => unfollowUser()}
                >
                  Unfollow
                </button>
              )}
            </div>
          </div>

          <div className="gallery">
            <ImageList
              sx={{ width: 500, height: 450 }}
              cols={3}
              rowHeight={164}
            >
              {usersProfile.posts.map((item) => (
                <ImageListItem key={item._id}>
                  <img src={item.photo} loading="lazy" />
                </ImageListItem>
              ))}
            </ImageList>
          </div>
        </div>
      ) : (
        <div
          style={{
            margin: "30px auto",
            maxWidth: "150px",
            padding: "20px",
            textAlign: "center",
            marginTop: "100px",
          }}
        >
          <Audio height="100" width="100" color="red" ariaLabel="loading" />
        </div>
      )}
    </>
  );
}

export default UserProfile;
