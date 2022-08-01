import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MarketPlaceBottomNav from "../MarketPlaceNav/MarketPlaceBottomNav";
import MarketPlaceNav from "../MarketPlaceNav/MarketPlaceNav";
import M from "materialize-css";

const EditMyAds = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const { productId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionStorage.getItem("user")) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(`/getdetails/${productId}`, {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("jwt"),
        },
      });
      setTitle(data.product.title);
      setPrice(data.product.price);
      setLocation(data.product.location);
      setDescription(data.product.description);
    };
    fetchData();
  }, []);

  const postDetails = async () => {
    await axios
      .post(
        "/updatemyproduct",
        {
          title,
          location,
          price,
          description,
          productId,
        },
        {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("jwt"),
          },
        }
      )
      .then((result) => {
        M.toast({
          html: "edited successfully",
          classes: "#ef5350 green lighten-1",
        });
        navigate("/marketplace");
      })
      .catch((error) => {
        M.toast({
          html: "please add all fields",
          classes: "#ef5350 red lighten-1",
        });
        console.log(error);
      });
  };
  return (
    <div>
      <MarketPlaceNav />
      <div
        className="card input-field"
        style={{
          margin: "30px auto",
          maxWidth: "500px",
          padding: "20px",
          textAlign: "center",
          marginTop: "100px",
        }}
      >
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          className="btn waves-effect waves-light #42a5f5 blue darken-1"
          onClick={() => {
            postDetails();
          }}
        >
          submit
        </button>
      </div>
      <MarketPlaceBottomNav />
    </div>
  );
};

export default EditMyAds;
