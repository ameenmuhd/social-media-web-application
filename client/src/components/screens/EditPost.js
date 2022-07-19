import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import React, { useState, useEffect } from "react";
import CardMedia from "@mui/material/CardMedia";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import M from "materialize-css";
import { Audio } from "react-loader-spinner";

function EditPost() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState("");
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  console.log("drt", postId);
  useEffect(() => {
    fetch(`/editpost/${postId}`, {
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setPost(result);
        setTitle(result.post.title);
      });
  }, [postId, image]);

  const postUpdate = () => {
    if (!image) {
      fetch("/updatepost", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          title,
          postId: post.post._id,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          M.toast({
            html: "updated successfully",
            classes: "#00e676 green accent-3",
          });
          navigate("/");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
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
          if (data.url) {
            console.log("called");
            fetch("/updatepost", {
              method: "put",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + sessionStorage.getItem("jwt"),
              },
              body: JSON.stringify({
                title,
                pic: data.url,
                postId: post.post._id,
              }),
            })
              .then((res) => {
                return res.json();
              })
              .then((data) => {
                if (data.error) {
                  M.toast({
                    html: data.error,
                    classes: "#ef5350 red lighten-1",
                  });
                } else {
                  M.toast({
                    html: "created successfully",
                    classes: "#00e676 green accent-3",
                  });
                  navigate("/");
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <>
      {post ? (
        <div
          className="card input-field"
          style={{
            margin: "30px auto",
            maxWidth: "500px",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="file-field input-field">
            <CardMedia
              component="img"
              height="180"
              image={post.post.photo}
              alt="green iguana"
            />
          </div>
          <div className="file-field input-field">
            <div className="btn #42a5f5 blue darken-1">
              <span>change image</span>
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>
            <div className="file-path-wrapper">
              <input className="file-path validate" type="text" />
            </div>
          </div>
          <button
            className="btn waves-effect waves-light #42a5f5 blue darken-1"
            onClick={() => postUpdate()}
          >
            save
          </button>
        </div>
      ) : (
        <div
          style={{
            margin: "30px auto",
            maxWidth: "150px",
            padding: "20px",
            textAlign: "center",
            marginTop: "100px",
          }}
        >
          <Audio height="100" width="100" color="red" ariaLabel="loading" />
        </div>
      )}
    </>
  );
}

export default EditPost;
