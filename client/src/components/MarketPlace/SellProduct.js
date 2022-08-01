import React, { useEffect, useState } from "react";
import BottomNavbar from "../BottomNavbar/BottomNavbar";
import MarketPlaceNav from "../MarketPlaceNav/MarketPlaceNav";
import M from "materialize-css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import LinearProgress from '@mui/material/LinearProgress';


function SellProduct() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const navigate = useNavigate();
  const [age, setAge] = React.useState("");
  const [allCategory,setAllCategory] = useState([])
  const [loading,setLoading] = useState(false)

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  useEffect(() => {
    if (!sessionStorage.getItem("user")) {
      navigate("/login");
    }
  }, []);

  React.useEffect(() => {
    const fetchCategory = async () => {
      const { data } = await axios.get("/allcategory");
      setAllCategory(data.category);
    };
    fetchCategory();
  }, [allCategory]);

  useEffect(() => {
    if (url) {
      const postProduct = async () => {
        const response = await axios.post(
          "/sellproduct",
          {
            title,
            price,
            category,
            location,
            description,
            url,
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
        navigate("/marketplace");
      };
      postProduct();
      setLoading(false)
    }
  }, [url]);

  const postDetails = async () => {
    setLoading(true)
    if (!image || !description || !location || !category || !price || !title) {
        M.toast({
        html: "please add all fields",
        classes: "#ef5350 red lighten-1",
      })
      setLoading(false)
      return
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
      {loading ? 
      <LinearProgress sx={{marginTop:"68px"}}/>
      : ""
      }
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
        {/* <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        /> */}
        <FormControl sx={{ minWidth: "100%" }} size="large">
          <InputLabel id="demo-select-small">Category</InputLabel>
          <Select
            labelId="demo-select-small"
            id="demo-select-small"
            value={age}
            label="Age"
            onChange={handleChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {allCategory.map((item)=>{
              return (
              <MenuItem value={item._id} onClick={()=>setCategory(item.name)}>{item.name}</MenuItem>
              )
            })}
          </Select>
        </FormControl>
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
