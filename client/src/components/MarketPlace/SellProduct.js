import React, { useEffect, useState } from "react";
import BottomNavbar from "../BottomNavbar/BottomNavbar";
import MarketPlaceNav from "../MarketPlaceNav/MarketPlaceNav";
import M from "materialize-css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SellProduct() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionStorage.getItem("user")) {
      navigate("/login");
    }
  }, []);

  useEffect(()=>{
    if(url){
        const postProduct = async () => {
            const response = await axios.post(
              "/sellproduct",
              {
                title,
                price,
                category,
                location,
                description,
                url 
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + sessionStorage.getItem("jwt"),
                },
              }
            );
            console.log(response);
            // setMessages(response.data);
          };
          postProduct();
    }
  },[url])


  const postDetails = async () => {
    if (!image || !description || !location || !category || !price || !title) {
      return M.toast({
        html: "please add all fields",
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
        setUrl(data.url);
      })
      .catch((err) => {
        console.log(err);
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
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <textarea
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="file-field input-field">
          <div className="btn #42a5f5 blue darken-1">
            <span>upload image</span>
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>
        <button
          className="btn waves-effect waves-light #42a5f5 blue darken-1"
          onClick={() => {
            postDetails();
          }}
        >
          submit
        </button>
      </div>
      <BottomNavbar />
    </div>
  );
}

export default SellProduct;
