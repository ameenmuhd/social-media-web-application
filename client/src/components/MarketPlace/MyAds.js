import React, { useContext, useEffect, useState } from "react";
import MarketPlaceBottomNav from "../MarketPlaceNav/MarketPlaceBottomNav";
import MarketPlaceNav from "../MarketPlaceNav/MarketPlaceNav";
import "./MyAds.css";
import axios from "axios";
import { UserContext } from "../../App";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Stack from "@mui/material/Stack";
import swal from "sweetalert";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import ShowLoading from "../showLoadingComponents/ShowLoading";

const MyAds = () => {
  const [products, setProducts] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const { userId } = useParams();
  const navigate = useNavigate();
  const [loading,setLoading] = useState(false)

  useEffect(() => {
    if (!sessionStorage.getItem("user")) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    setLoading(true)
    const fetchMyAds = async () => {
      const { data } = await axios.get(`/getmyads/${userId}`, {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("jwt"),
        },
      });
      console.log(data);
      setProducts(data.products);
    };
    fetchMyAds();
    setLoading(false)
  }, []);

  const deleteAd = async (itemId) => {
    try {
      await axios.get(`/deleteproduct/${itemId}`).then((result) => {
        console.log(result);
        const newData = products.filter((item) => {
          return item._id !== result.data._id;
        });
        setProducts(newData);
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {state ? (
        <>
          <MarketPlaceNav />
          {products.length !== 0 ? (
            <div className="row">
              {products.map((items) => {
                return (
                  <div className="column">
                    <Card sx={{ maxWidth: 345 }}>
                      <CardMedia
                        component="img"
                        height="140"
                        image={items.photo}
                        alt="loading..."
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {items.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {items.description}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Stack direction="row" spacing={2}>
                          <Link to={`/editmyads/${items._id}`}>
                          <Button variant="contained" endIcon={<EditIcon />}>
                            Edit
                          </Button>
                          </Link>
                          <Button
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => {
                              swal({
                                title: "Are you sure to delete post?",
                                icon: "warning",
                                buttons: true,
                                dangerMode: true,
                              }).then((willDelete) => {
                                if (willDelete) {
                                  deleteAd(items._id);
                                  swal("Your post has been deleted!", {
                                    icon: "success",
                                  });
                                }
                              });
                            }}
                          >
                            Delete
                          </Button>
                        </Stack>
                      </CardActions>
                    </Card>
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              style={{
                marginTop: "200px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <h4>You haven't posted anything</h4>
            </div>
          )}

          <MarketPlaceBottomNav />
        </>
      ) : (
        <ShowLoading loading={loading}/>
      )}
    </div>
  );
};

export default MyAds;
