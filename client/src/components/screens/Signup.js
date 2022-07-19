import React, { useState,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import M from "materialize-css";

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState(undefined);

  useEffect(()=>{
    if(url){
        uploadFields()
    }
  },[url])
  const uploadPic = () =>{
    const data = new FormData()
        data.append("file", image)
        data.append("upload_preset", "project2")
        data.append("cloud_name", "ameen123")
        fetch("https://api.cloudinary.com/v1_1/ameen123/image/upload", {
            method: "post",
            body: data
        }).then(res => res.json()).then(data => {
            setUrl(data.url)
        }).catch((err) => {
            console.log(err);
        })
  }

  const uploadFields = ()=>{
    if (confirmPassword !== password) {
        return M.toast({
          html: "confirm password must match new password",
          classes: "#ef5350 red lighten-1",
        });
      }
  
      if (
        !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          email
        )
      ) {
        M.toast({ html: "invalid email", classes: "#ef5350 red lighten-1" });
        return;
      }
      if (!/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/.test(name)) {
        M.toast({ html: "invalid name", classes: "#ef5350 red lighten-1" });
        return;
      }
      if (
        !/^(\S)(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹])[a-zA-Z0-9~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]{6,16}$/.test(
          password
        )
      ) {
        M.toast({
          html: "password must contain one uppercase,lowercase,numeric,special character and must be 8-16",
          classes: "#ef5350 red lighten-1",
        });
        return;
      }
      fetch("/signup", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          password,
          email,
          pic:url
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (data.error) {
            M.toast({ html: data.error, classes: "#ef5350 red lighten-1" });
          } else {
            M.toast({ html: data.message, classes: "#00e676 green accent-3" });
            navigate("/login");
          }
        })
        .catch((err) => {
          console.log(err);
        });
  }

  const postData = () => {
    if(image){
        uploadPic()
    }else{
        uploadFields()
    }
  };
  return (
    <div className="mycard">
      <div className="card auth-card input-field">
        <h2 className="brndname"></h2>
        <input
          type="text"
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
          className="btn waves-effect waves-light #42a5f5 blue lighten-1"
          onClick={() => postData()}
        >
          signup
        </button>
        <h5>
          <Link to="/login">Already have an account ?</Link>
        </h5>
      </div>
    </div>
  );
}

export default Signup;
