import React, { useEffect, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../../../App";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import M from "materialize-css";
import { Audio } from "react-loader-spinner";
import BottomNavbar from "../../BottomNavbar/BottomNavbar";
import Navbar from "../../Navbar/Navbar";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

function UserEdit() {
  const { userId } = useParams();
  const [value, setValue] = React.useState(0);
  const [user, setUser] = React.useState(null);
  const [name, setName] = React.useState("");
  const [image, setImage] = React.useState("");
  const [oldPassword, setOldPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const { state, dispatch } = useContext(UserContext);
  const [img,setImg] = useState("")

  useEffect(() => {
    fetch(`/edituser/${userId}`, {
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setUser(result);
        setName(result.user.name);
        setImage(result.user.pic);
      });
  }, [userId]);

  const updateDetails = () => {
    fetch("/updateuser", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        name,
        userId,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log("sa", result);
        if (result.error) {
          return M.toast({
            html: result.error,
            classes: "#ef5350 red lighten-1",
          });
        }
        dispatch({ type: "UPDATENAME", payload: { name: result.name } });
        console.log(state);
        sessionStorage.setItem("user", JSON.stringify(result));

        M.toast({
          html: "updated successfully",
          classes: "#00e676 green accent-3",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onImageChange = (event) => {
    setImage(event.target.files[0]);
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (e) => {
        setImg(e.target.result);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const updatePhoto = () => {
    
      if (!img) {
        return M.toast({
          html: "please choose an image by clicking the photo",
          classes: "#ef5350 red lighten-1",
        });
      }
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "project2");
        data.append("cloud_name", "ameen123");
        fetch("https://api.cloudinary.com/v1_1/ameen123/image/upload", {
          method: "post",
          body: data,
        })
          .then((res) => res.json())
          .then((data) => {
            fetch("/updatepic", {
              method: "put",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + sessionStorage.getItem("jwt"),
              },
              body: JSON.stringify({
                pic: data.url,
              }),
            })
              .then((res) => res.json())
              .then((result) => {
                sessionStorage.setItem(
                  "user",
                  JSON.stringify({ ...state, pic: result.pic })
                );
                dispatch({ type: "UPDATEPIC", payload: { pic: result.pic } });
                M.toast({ html: "updated", classes: "#00e676 green accent-3" });
                setImg("")
              });
          })
          .catch((err) => {
            console.log(err);
          });
      
  };

  const updatePassword = () => {
    if (confirmPassword !== newPassword) {
      return M.toast({
        html: "confirm password must match new password",
        classes: "#ef5350 red lighten-1",
      });
    }

    fetch("/updatepassword", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        oldPassword,
        newPassword,
        userId,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.error) {
          return M.toast({
            html: data.error,
            classes: "#ef5350 red lighten-1",
          });
        }
        M.toast({ html: data.msg, classes: "#00e676 green accent-3" });
      });
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Navbar />
      <Box
        className="card"
        sx={{
          flexGrow: 1,
          bgcolor: "background.paper",
          display: "flex",
          height: 500,
        }}
        style={{
          margin: "30px auto",
          maxWidth: "500px",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          sx={{ borderRight: 1, borderColor: "divider" }}
        >
          <Tab label="Details" {...a11yProps(0)} />
          <Tab label="Password" {...a11yProps(1)} />
        </Tabs>
        <TabPanel value={value} index={0}>
          {user ? (
            <>
              <div>
                <label htmlFor="file">
                  <img
                    src={ img ? img :  state.pic}
                    alt="no imag.."
                    style={{
                      width: "160px",
                      height: "160px",
                      borderRadius: "80px",
                    }}
                    id="target"
                  />
                  <input
                    id="file"
                    style={{ display: "none" }}
                    type="file"
                    onChange={onImageChange}
                  />
                </label>
                <div>
                  <button className="btn waves-effect waves-light #42a5f5 blue darken-1" onClick={()=>updatePhoto()}>
                    update
                  </button>
                </div>
              </div>
              <div
                className="card input-field"
                style={{
                  margin: "30px auto",
                  maxWidth: "500px",
                  padding: "20px",
                  textAlign: "center",
                  marginTop: "10px",
                }}
              >
                <input
                  type="text"
                  placeholder="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <button
                  className="btn waves-effect waves-light #42a5f5 blue darken-1"
                  onClick={() => updateDetails()}
                >
                  save
                </button>
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
        </TabPanel>
        <TabPanel value={value} index={1}>
          <div
            className="card input-field"
            style={{
              margin: "30px auto",
              maxWidth: "350px",
              padding: "20px",
              textAlign: "center",
              marginTop: "10px",
            }}
          >
            <input
              type="password"
              placeholder="old password"
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="new password"
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="confirm password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button
              className="btn waves-effect waves-light #42a5f5 blue darken-1"
              onClick={() => {
                updatePassword();
              }}
            >
              submit
            </button>
          </div>
        </TabPanel>
      </Box>
      <BottomNavbar />
    </>
  );
}

export default UserEdit;
