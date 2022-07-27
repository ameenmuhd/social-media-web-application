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

function MarketPlace() {
  const { state, dispatch } = useContext(UserContext);
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

  return (
    <div>
      {products ? (
        <>
          <MarketPlaceNav />
          <div className="row">
            {products.map((item, index) => {
              return (
                <div className="column" key={index}>
                  <Link to={`/product-details/${item._id}`}>
                  <Card sx={{ maxWidth: 345 }}>
                    <CardMedia
                      component="img"
                      alt="green iguana"
                      height="140"
                      image={item.photo}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        ${item.price}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.title}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button variant="contained">Message</Button>
                    </CardActions>
                  </Card>
                  </Link>
                </div>
              );
            })}
          </div>

          <BottomNavbar />
        </>
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
}

export default MarketPlace;
