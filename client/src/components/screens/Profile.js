import React, { useEffect, useState, useContext } from "react";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { UserContext } from "../../App";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Audio } from "react-loader-spinner";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import BottomNavbar from "../BottomNavbar/BottomNavbar";

function Profile() {
  const [mypics, setMypics] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionStorage.getItem("user")) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    fetch("/mypost", {
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(state);
        setMypics(result.myposts);
      });
  }, []);
  return (
    <>
      <Navbar />
      <div style={{ maxWidth: "550px", margin: "0px auto" }}>
        {state ? (
          <>
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
                  src={state ? state.pic : "loading..."}
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
                    {state ? state.name : "loading.."}
                  </Box>
                  <Box
                    sx={{
                      fontSize: 15,
                      m: 1,
                      lineHeight: 1,
                      fontWeight: "light",
                    }}
                  >
                    {state ? state.email : "loading.."}
                  </Box>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "108%",
                    }}
                  >
                    <h6>{mypics.length} posts</h6>
                    <h6>{state ? state.followers.length : 0} followers</h6>
                    <h6>{state ? state.following.length : 0} following</h6>
                  </div>
                </Typography>
                <Link to={`/edituser/${state._id}`}>
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: "black" }}
                    startIcon={<EditIcon />}
                  >
                    edit profile
                  </Button>
                </Link>
              </div>
            </div>

            <div className="gallery">
              <ImageList
                sx={{ width: 500, height: 450 }}
                cols={3}
                rowHeight={164}
              >
                {mypics.map((item) => (
                  <ImageListItem key={item._id}>
                    <img src={item.photo} loading="lazy" />
                  </ImageListItem>
                ))}
              </ImageList>
            </div>
          </>
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
      </div>
      <BottomNavbar />
    </>
  );
}

export default Profile;
