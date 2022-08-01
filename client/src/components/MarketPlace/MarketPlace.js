import React, { useContext, useState } from "react";
import BottomNavbar from "../BottomNavbar/BottomNavbar";
import MarketPlaceNav from "../MarketPlaceNav/MarketPlaceNav";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { UserContext } from "../../App";
import "./MarketPlace.css";
import { useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import M from "materialize-css";
import { ChatState } from "../../Context/ChatProvider";
import { format } from "timeago.js";
import MarketPlaceBottomNav from "../MarketPlaceNav/MarketPlaceBottomNav";


function MarketPlace() {
  const { state, dispatch } = useContext(UserContext);
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionStorage.getItem("user")) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    const fetchAllProducts = async () => {
      const data = await axios.get("/allproducts", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("jwt"),
        },
      });
      setProducts(data.data.products);
    };
    fetchAllProducts();
  }, []);

  const accessChat = async (userId) => {
    try {
        const { data } = await axios.post('/personalchat',{
          userId
        }, {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + sessionStorage.getItem("jwt"),
            },
          });
          if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
          setSelectedChat(data);
          // setLoadingChat(false);
          // setIsDrawerOpen(false);
          navigate(`/chat/${state._id}`)
    } catch (error) {
      console.log(error);
      M.toast({
        html: "some error occured",
        classes: "#ef5350 red lighten-1",
      });
    }
  }

  return (
    <div>
      {state && products ? (
        <>
          <MarketPlaceNav />
          <div className="row" style={{marginBottom:"60px"}}>
            {products.map((item, index) => {
              return (
                <div className="column" key={index}>
                  <Card sx={{ maxWidth: 345 }}>
                  <Link to={`/product-details/${item._id}`}>
                    <CardMedia
                      component="img"
                      alt="green iguana"
                      height="140"
                      image={item.photo}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        ₹{item.price}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.description}
                      </Typography>
                    </CardContent>
                      </Link>
                    <CardActions sx={{display:"flex",justifyContent:"space-between" }}>
                      {state._id === item.postedBy._id ? 
                            ""
                        : 
                        <Button variant="contained" onClick={()=>{accessChat(item.postedBy)}}>Message</Button>
                        }
                        <p style={{ fontSize: "10px", color: "text.tertiary"}}>
                    {format(item.createdAt)}
                  </p>
                    </CardActions>
                  </Card>
                </div>
              );
            })}
          </div>

          <MarketPlaceBottomNav/>
        </>
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
}

export default MarketPlace;
