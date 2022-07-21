import React, { useState, useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../../App'
import M from 'materialize-css'

function Login() {
    const { state, dispatch } = useContext(UserContext)
    const navigate = useNavigate();
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')

    useEffect(() => {
        if (sessionStorage.getItem("user")) {
          navigate("/");
        }
      }, []);



    const postData = () => {
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            M.toast({ html: 'invalid email', classes: "#ef5350 red lighten-1" })
            return
        }
        if (!password) {
            M.toast({ html: 'please enter your password', classes: "#ef5350 red lighten-1" })
            return
        }
        fetch("/login", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password,
                email
            })
        }).then((res) => {
            return res.json()
        }).then((data) => {
            console.log(data)
            if (data.error) {
                return M.toast({ html: data.error, classes: "#ef5350 red lighten-1" })
            }
            if (data.type === "user") {
                sessionStorage.setItem("jwt", data.token)
                sessionStorage.setItem("user", JSON.stringify(data.user))
                dispatch({ type: "USER", payload: data.user })
                M.toast({ html: "signedin successfully", classes: "#00e676 green accent-3" })
                navigate('/')
            }


        }).catch((err) => {
            console.log(err);
        })
    }


    return (
        <div className='mycard'>
            <div className="card auth-card input-field">
                <h2 className='brndname'></h2>
                <input type="text" placeholder='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                <button className="btn waves-effect waves-light #42a5f5 blue lighten-1" onClick={() => postData()}>login</button>
                <h5><Link to="/signup">Don't have an account ?</Link></h5>
            </div>
        </div>
    )
}

export default Login