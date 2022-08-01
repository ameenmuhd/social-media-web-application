import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { Drawer, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import M from "materialize-css";
import axios from "axios";
import UserListItem from "../UserListItem/UserListItem";
import { ChatState } from "../../Context/ChatProvider";
import { Link } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";

export default function MenuAppBar() {
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [search, setSearch] = React.useState("");
  const [searchResult, setSearchResult] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [loadingChat, setLoadingChat] = React.useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSearch = async () => {
    if (!search) {
      M.toast({
        html: "please enter user name",
        classes: "#ef5350 red lighten-1",
      });
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.get(`/search-users-chat?search=${search}`, {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("jwt"),
        },
      });
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      console.log(error);
      M.toast({
        html: "some error occured",
        classes: "#ef5350 red lighten-1",
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const { data } = await axios.post(
        "/personalchat",
        {
          userId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("jwt"),
          },
        }
      );
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      setIsDrawerOpen(false);
    } catch (error) {
      console.log(error);
      M.toast({
        html: "some error occured",
        classes: "#ef5350 red lighten-1",
      });
    }
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ bgcolor: "white" }}>
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              aria-label="menu"
              sx={{ mr: 2, color: "black" }}
              onClick={() => setIsDrawerOpen(true)}
            >
              <SearchIcon />
            </IconButton>
            <Typography
              variant="h4"
              component="div"
              sx={{ flexGrow: 1, color: "black" }}
            >
              <Link to={user ? "/" : "/login"} className="brand-logo">
                Messages
              </Link>
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
      <div>
        <Drawer
          open={isDrawerOpen}
          onClose={() => {
            setIsDrawerOpen(false);
          }}
        >
          <Box p={2} width="270px" textAlign="center" role="presentation">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                "& > :not(style)": { m: 1 },
              }}
            >
              <input
                placeholder="search users"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button variant="contained" onClick={handleSearch}>
                Go
              </Button>
            </Box>
            {loading ? (
              <Box sx={{ width: "100%" }}>
                <Skeleton />
                <Skeleton animation="wave" />
                <Skeleton animation={false} />
              </Box>
            ) : (
              searchResult?.slice(0, 4).map((user) => {
                return (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user)}
                  />
                );
              })
            )}
            {loadingChat && (
              <Box sx={{ width: "100%" }}>
                <Skeleton />
                <Skeleton animation="wave" />
                <Skeleton animation={false} />
              </Box>
            )}
          </Box>
        </Drawer>
      </div>
    </>
  );
}
