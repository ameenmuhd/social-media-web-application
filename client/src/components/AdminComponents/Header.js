import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import HelpIcon from "@mui/icons-material/Help";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { TabContext, TabPanel } from "@mui/lab";
import M from "materialize-css";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  ButtonGroup,
} from "@mui/material";
import axios from "axios";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";

const lightColor = "rgba(255, 255, 255, 0.7)";

function Header(props) {
  const { onDrawerToggle } = props;
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [value, setValue] = React.useState("1");
  const [details, setDetails] = React.useState([]);
  const [category, setCategory] = React.useState("");
  const [allCategory, setAllCategory] = React.useState([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await axios.get("/allusers");
      console.log(data);
      setDetails(data.users);
    };
    fetchUsers();
  }, []);

  React.useEffect(() => {
    const fetchCategory = async () => {
      const { data } = await axios.get("/allcategory");
      setAllCategory(data.category);
    };
    fetchCategory();
  }, [allCategory]);

  const blockUser = async (userId) => {
    const { data } = await axios.get(`/blockuser/${userId}`);
    console.log(data);
    setDetails(data.users);
  };

  const unblockUser = async (userId) => {
    const { data } = await axios.get(`/unblockuser/${userId}`);
    console.log(data);
    setDetails(data.users);
  };

  const logout = () => {
    sessionStorage.clear();
    navigate("/adminlogin");
  };

  const addcategory = async () => {
    try {
      if (!category) {
        return M.toast({
          html: "please add all fields",
          classes: "#ef5350 red lighten-1",
        });
      }
      const { data } = await axios.post("/addcategory", { category });
      setAllCategory([data.category]);
    } catch (error) {
      return M.toast({
        html: error.response.data.error,
        classes: "#ef5350 red lighten-1",
      });
    }
  };

  const deleteCategory = async (categoryId) => {
    const { data } = axios.delete(`/deletecategory/${categoryId}`);
  };

  return (
    <React.Fragment>
      <AppBar color="primary" position="sticky" elevation={0}>
        <Toolbar>
          <Grid container spacing={1} alignItems="center">
            <Grid sx={{ display: { sm: "none", xs: "block" } }} item>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={onDrawerToggle}
                edge="start"
              >
                <MenuIcon />
              </IconButton>
            </Grid>
            <Grid item xs />
            <Grid item>
              <Button
                variant="contained"
                color="error"
                startIcon={<LogoutIcon />}
                onClick={() => logout()}
              >
                logout
              </Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <AppBar
        component="div"
        color="primary"
        position="static"
        elevation={0}
        sx={{ zIndex: 0 }}
      >
        <Toolbar>
          <Grid container alignItems="center" spacing={1}>
            <Grid item xs>
              <Typography color="inherit" variant="h5" component="h1">
                Admin
              </Typography>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      {/* <AppBar
        component="div"
        position="static"
        elevation={0}
        sx={{ zIndex: 0 }}
      > */}
      <TabContext value={value}>
        <Tabs onChange={handleChange} textColor="inherit">
          <Tab label="Users" value={1} />
          <Tab label="Category" value={2} />
          {/* <Tab label="Templates" value="3" />
            <Tab label="Usage" value="4" /> */}
        </Tabs>
        <TabPanel value={1}>
          <div>
            <div className="container">
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 500 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Username </TableCell>
                      <TableCell align="right">Email</TableCell>
                      <TableCell align="right">Proifile picture</TableCell>
                      <TableCell align="right">Options</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {details.map((row) => (
                      <TableRow key={details._id}>
                        <TableCell component="th" scope="row">
                          {row.name}
                        </TableCell>
                        <TableCell align="right">{row.email}</TableCell>
                        <TableCell align="right">
                          <img
                            style={{ width: "100px", height: "100px" }}
                            src={row.pic}
                          />
                        </TableCell>
                        <TableCell align="right">
                          {" "}
                          <ButtonGroup
                            variant="contained"
                            aria-label="outlined primary button group"
                          >
                            {row.isBlocked ? (
                              <Button onClick={() => unblockUser(row._id)}>
                                {" "}
                                UnBlock
                              </Button>
                            ) : (
                              <Button onClick={() => blockUser(row._id)}>
                                Block
                              </Button>
                            )}
                          </ButtonGroup>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        </TabPanel>
        <TabPanel value={2}>
          <div>
            <div className="container">
              <div className="mycard">
                <div className="card auth-card input-field">
                  <h2 className="brndname"></h2>
                  <input
                    type="text"
                    placeholder="add a category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                  <button
                    className="btn waves-effect waves-light #42a5f5 blue lighten-1"
                    onClick={() => addcategory()}
                  >
                    Add
                  </button>
                </div>
              </div>
              <TableContainer component={Paper}>
                <Table sx={{ width: 500,marginLeft:"auto",marginRight:"auto" }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>category </TableCell>

                      <TableCell>Options</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {allCategory.map((item) => (
                      <TableRow key={item._id}>
                        <TableCell component="th" scope="row">
                          {item.name}
                        </TableCell>
                        <TableCell>
                          {" "}
                          <ButtonGroup
                            variant="contained"
                            aria-label="outlined primary button group"
                          >
                            <Button onClick={() => deleteCategory(item._id)}>
                              Delete
                            </Button>
                          </ButtonGroup>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        </TabPanel>
      </TabContext>
      {/* </AppBar> */}
    </React.Fragment>
  );
}

Header.propTypes = {
  onDrawerToggle: PropTypes.func.isRequired,
};

export default Header;
