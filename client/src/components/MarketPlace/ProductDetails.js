import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import MarketPlaceNav from "../MarketPlaceNav/MarketPlaceNav";
import { format } from "timeago.js";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import "./ProductDetails.css";
import { UserContext } from "../../App";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import MarketPlaceBottomNav from "../MarketPlaceNav/MarketPlaceBottomNav";
import ShowLoading from "../showLoadingComponents/ShowLoading";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function ProductDetails() {
  const [userDetails, setUserDetails] = useState();
  const [data, setData] = useState();
  const { productId } = useParams();
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate();
  const { state, dispatch } = useContext(UserContext);

  console.log(data);

  useEffect(() => {
    if (!sessionStorage.getItem("user")) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    setLoading(true)
    const fetchData = async () => {
      const { data } = await axios.get(`/getdetails/${productId}`, {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("jwt"),
        },
      });

      console.log(data);
      setData(data);
      setLoading(false)
    };
    fetchData();
  }, []);

  return (
    <>
      {data ? (
        <div>
          <MarketPlaceNav />
          <div className="container">
            <div className="box1">
              <img
                style={{ width: "100%" }}
                src={data.product.photo}
                alt="no"
              />
            </div>
            <div className="box2">
              <Paper elevation={6}>
                <Box p={1}>
                  <p style={{ fontWeight: 500, fontSize: "2rem" }}>₹{data.product.price}</p>
                  <h5 style={{ fontSize: "1.5rem" }}>Description</h5>
                  <p style={{ marginLeft: "8px" }}>
                    {data.product.description}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "12px",
                      color: "text.tertiary",
                    }}
                  >
                    <span>{data.product.location}</span>
                    <span>{format(data.product.createdAt)}</span>
                  </div>
                </Box>
              </Paper>
              <Paper elevation={6}>
                <Box sx={{ marginTop: "20px" }} p={1}>
                  <h5>Seller Information</h5>
                  <List
                    dense
                    sx={{
                      width: "100%",
                      maxWidth: 360,
                      bgcolor: "background.paper",
                    }}
                  >
                    <Link
                      to={
                        data.product.postedBy._id !== state._id
                          ? "/profile/" + data.product.postedBy._id
                          : "/profile"
                      }
                    >
                      <ListItem
                        secondaryAction={<ArrowForwardIosIcon edge="end" />}
                        disablePadding
                      >
                        <ListItemButton>
                          <ListItemAvatar>
                            <Avatar
                              alt="no image"
                              src={data.product.postedBy.pic}
                            />
                          </ListItemAvatar>
                          <ListItemText primary={data.product.postedBy.name} />
                        </ListItemButton>
                      </ListItem>
                    </Link>
                  </List>
                </Box>
              </Paper>
            </div>
          </div>
          <MarketPlaceBottomNav/>
        </div>
      ) : (
        <ShowLoading loading={loading}/>
      )}
    </>
  );
}
export default ProductDetails;
