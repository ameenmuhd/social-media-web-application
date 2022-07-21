import React, { useState, useEffect } from 'react';
import M from 'materialize-css';
import { useNavigate } from 'react-router-dom';


function CreatePost() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('')
    const [image, setImage] = useState('')
    const [url, setUrl] = useState('')

    useEffect(() => {
        if (!sessionStorage.getItem("user")) {
          navigate("/login");
        }
      }, []);

    useEffect(() => {
        if (url) {
            fetch("/createpost", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + sessionStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    title,
                    pic: url
                })
            }).then((res) => {
                return res.json()
            }).then((data) => {
                if (data.error) {
                    M.toast({ html: data.error, classes: "#ef5350 red lighten-1" })
                } else {
                    M.toast({ html: "created successfully", classes: "#00e676 green accent-3" })
                    navigate('/')
                }
            }).catch((err) => {
                console.log(err);
            })
        }
    }, [url])

    const postDetails = () => {
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

    return (
        <div className='card input-field' style={{ margin: "30px auto", maxWidth: "500px", padding: "20px", textAlign: "center" }}>
            <input type="text" placeholder='caption' value={title} onChange={(e) => setTitle(e.target.value)} />
            <div className="file-field input-field">
                <div className="btn #42a5f5 blue darken-1">
                    <span>upload image</span>
                    <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
            <button className="btn waves-effect waves-light #42a5f5 blue darken-1" onClick={() => { postDetails() }}>submit</button>
        </div>
    )
}

export default CreatePost