import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../../App'
import { Link } from 'react-router-dom'
import M from 'materialize-css'
import AspectRatio from '@mui/joy/AspectRatio';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import CardOverflow from '@mui/joy/CardOverflow';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';


function Home() {
    const [data, setData] = useState([])
    const { state, dispatch } = useContext(UserContext)
    useEffect(() => {
        fetch('/getsubpost', {
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("jwt")
            }
        }).then(res => res.json()).then(result => {
            setData(result.posts)
        })
    }, [])

    const likePost = (id) => {
        fetch('/like', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + sessionStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json()).then(result => {
            //console.log(result);
            const newData = data.map(item => {
                if (item._id === result._id) {
                    return result
                } else {
                    return item
                }
            })
            setData(newData)
        }).catch((err) => {
            console.log(err)
        })
    }

    const unlikePost = (id) => {
        fetch('/unlike', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + sessionStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json()).then(result => {
            const newData = data.map(item => {
                if (item._id === result._id) {
                    return result
                } else {
                    return item
                }
            })
            setData(newData)
        }).catch((err) => {
            console.log(err)
        })
    }

    const makeComment = (text, postId) => {
        fetch('/comment', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + sessionStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId,
                text
            })
        }).then(res => res.json()).then(result => {
            console.log(result);
            const newData = data.map(item => {
                if (item._id === result._id) {
                    return result
                } else {
                    return item
                }
            })
            setData(newData)
        }).catch((err) => {
            console.log(err);
        })
    }

    const deletPost = (postId) => {
        fetch(`/deletepost/${postId}`, {
            method: "delete",
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("jwt")
            }
        }).then(res => res.json()).then(result => {
            const newData = data.filter(item => {
                return item._id !== result._id
            })
            setData(newData)
        })
    }

    const deleteComment = (postId, commentId) => {
        fetch(`/deletecomment/${postId}/${commentId}`, {
            method: "delete",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + sessionStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        result.postedBy = item.postedBy;
                        return result
                    }
                    else {
                        return item
                    }
                })
                setData(newData);
                M.toast({ html: "comment deleted successfully", classes: "#00e676 green accent-3" })
            })
    }

    return (
        <div className='home'>
            {
                data.map(item => {
                    return (
                        <div className='card home-card' key={item._id} style={{ borderColor: "none" }}>
                            <Card
                                variant="outlined"
                                sx={{
                                    minWidth: 300,
                                    '--Card-radius': (theme) => theme.vars.radius.xs,
                                    borderColor: 'white'
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', pb: 1.5, gap: 1 }}>
                                    <Box
                                        sx={{
                                            position: 'relative',
                                            '&:before': {
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                bottom: 0,
                                                right: 0,
                                                m: '-2px',
                                                borderRadius: '50%',
                                                background:
                                                    'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
                                            },
                                        }}
                                    >
                                        <Avatar
                                            size="sm"
                                            src="/static/logo.png"
                                            sx={{ p: 0.5, border: '2px solid', borderColor: 'background.body' }}
                                        />
                                    </Box>
                                    <Typography fontWeight="lg"><Link to={item.postedBy._id !== state._id ? "/profile/" + item.postedBy._id : "/profile"}>{item.postedBy.name}</Link></Typography>
                                </Box>
                                <CardOverflow>
                                    <AspectRatio>
                                        <img src={item.photo} alt="" />
                                    </AspectRatio>
                                </CardOverflow>
                                <Box sx={{ display: 'flex', alignItems: 'center', mx: -1, my: 1 }}>
                                    <Box sx={{ width: 0, display: 'flex', gap: 0.5 }}>
                                        {item.likes.includes(state._id) ?
                                            <i className="material-icons" onClick={() => { unlikePost(item._id) }} style={{ color: "red" }}>favorite</i>
                                            :
                                            <i className="material-icons" onClick={() => { likePost(item._id) }}>favorite_border</i>
                                        }
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mx: 'auto' }}>
                                        {[...Array(5)].map((_, index) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    borderRadius: '50%',
                                                    width: `max(${6 - index}px, 3px)`,
                                                    height: `max(${6 - index}px, 3px)`,
                                                    bgcolor: index === 0 ? 'primary.solidBg' : 'background.level3',
                                                }}
                                            />
                                        ))}
                                    </Box>
                                </Box>
                                <Link to="/"
                                    component="button"
                                    underline="none"
                                    fontSize="sm"
                                    fontWeight="lg"
                                    textColor="text.primary"
                                >
                                    {item.likes.length}  Likes
                                </Link>
                                <Typography fontSize="sm">
                                    <Link to={item.postedBy._id !== state._id ? "/profile/" + item.postedBy._id : "/profile"}
                                        style={{ fontWeight: "500", fontSize: "15px", marginRight: "5px" }}
                                    >
                                        {item.postedBy.name}
                                    </Link>{' '}
                                    {item.title}
                                </Typography>

                                <CardOverflow sx={{ p: 'var(--Card-padding)', }}>
                                    <h5 style={{ fontSize: "14px", fontWeight: "500" }}>comments</h5>
                                    {
                                        item.comments.map(record => {
                                            return (
                                                <h6 key={record._id}><span style={{ fontWeight: "500", fontSize: "14px" }}>{record.postedBy.name}</span>  {record.text} {record.postedBy._id === state._id && <i className="material-icons" style={{ fontSize: "12px", marginLeft: "5px" }} onClick={() => deleteComment(item._id, record._id)}>delete</i>}</h6>
                                            )
                                        })
                                    }
                                    <form onSubmit={(e) => {
                                        e.preventDefault()
                                        makeComment(e.target[0].value, item._id)
                                    }}>
                                        <Input
                                            variant="plain"
                                            size="sm"
                                            placeholder="Add a comment…"
                                            sx={{ flexGrow: 1, mr: 1, '--Input-focusedThickness': '0px' }}
                                        />
                                    </form>
                                </CardOverflow>
                            </Card>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Home