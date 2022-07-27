import axios from "axios";
import React, { useState } from "react";
import M from "materialize-css";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate()

  const postData = async () => {
    try {
      await axios
        .post("/adminlogin", {
          email,
          password,
        })
        .then((resp) => {
          if(resp.data){
            M.toast({
                html: "signedin successfully",
                classes: "#00e676 green accent-3",
              });
              navigate("/admin");
          }
        })
        .catch((error) => {
          return M.toast({
            html: error.response.data.error,
            classes: "#ef5350 red lighten-1",
          });
        });
    } catch (error) {
      return M.toast({
        html: "please fill all the fields",
        classes: "#ef5350 red lighten-1",
      });
    }
  };

  return (
    <div className="mycard">
      <div className="card auth-card input-field">
        <h2 className="brndname">Admin</h2>
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
        <button
          className="btn waves-effect waves-light #42a5f5 blue lighten-1"
          onClick={() => postData()}
        >
          login
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
