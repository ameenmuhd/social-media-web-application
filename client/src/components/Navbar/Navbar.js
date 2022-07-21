import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../App";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Button from "@mui/material/Button";
import MapsUgcIcon from "@mui/icons-material/MapsUgc";
import Avatar from "@mui/joy/Avatar";

function Navbar() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate();
  return (
    <>
      <Box sx={{ flexGrow: 1 }} className="marginNav">
        <AppBar position="fixed" sx={{ bgcolor: "white" }}>
          <Toolbar>
            <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
              <Link to={state ? "/" : "/login"} className="brand-logo">
                Logo
              </Link>
            </Typography>
            {state ? (
              <div>
                <Link to={`/chat/${state._id}`}>
                <IconButton sx={{color:"black"}}> 
                  <MapsUgcIcon />
                </IconButton>
                </Link>

                <IconButton onClick={handleMenu}>
                  <Avatar size="sm" alt="Remy Sharp" src={state.pic} />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleClose}>
                    <Link to={"/following"}>Following</Link>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      sessionStorage.clear();
                      dispatch({ type: "CLEAR" });
                      navigate("/login");
                    }}
                  >
                    Logout
                  </MenuItem>
                </Menu>
              </div>
            ) : (
              <>
                <Button color="inherit">
                  <Link to={"/login"}>Login</Link>
                </Button>
                <Button color="inherit">
                  <Link to={"/signup"}>Signup</Link>
                </Button>
              </>
            )}
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
}

export default Navbar;
