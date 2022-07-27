import React, { useContext, useEffect, useRef } from "react";
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
import M from "materialize-css";
import { stringify } from "uuid";

function Navbar() {
  const searchModal = useRef(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [search, setSearch] = React.useState("");
  const [userDetails,setUserDetails] = React.useState([])
  const { state, dispatch } = useContext(UserContext);
  
  useEffect(() => {
    M.Modal.init(searchModal.current);
  }, [state]);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const fetchUsers = (query) => {
    console.log('query',query);
    setSearch(query)
    fetch('/search-users',{
      method:"post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt"),
      },
      body:JSON.stringify({
        query
      })
    }).then(res=>res.json())
    .then((results)=>{
      console.log(results);
      setUserDetails(results.user)
    }) 
  }

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
                <Link to={"/"}>
                  <IconButton sx={{ color: "black", marginTop: "3px" }}>
                    <i
                      data-target="modal1"
                      className="material-icons modal-trigger"
                    >
                      search
                    </i>
                  </IconButton>
                </Link>

                <Link to={`/chat/${state._id}`}>
                  <IconButton sx={{ color: "black" }}>
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
                <div
                  id="modal1"
                  className="modal"
                  style={{ color: "black" }}
                  ref={searchModal}
                >
                  <div className="modal-content">
                    <input
                      type="text"
                      placeholder="Search"
                      value={search}
                      onChange={(e) => fetchUsers(e.target.value)}
                    />
                    <ul className="collection">
                      {userDetails.map((item)=>{
                        return   <Link to={item._id !== state._id ? '/profile/'+item._id : '/profile'} onClick={()=>{
                          M.Modal.getInstance(searchModal.current).close()
                          setSearch('')
                        }}><li className="collection-item">{item.name}</li></Link>
                        
                      })}
                    </ul>
                  </div>
                  <div className="modal-footer">
                    <button className="modal-close waves-effect waves-green btn-flat" onClick={()=>setSearch('')}>
                      close
                    </button>
                  </div>
                </div>
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
