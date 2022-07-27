import axios from 'axios';
import React,{useEffect,useState,useContext} from 'react';
import { Link, useParams } from 'react-router-dom';
import MarketPlaceNav from '../MarketPlaceNav/MarketPlaceNav';
import { format } from "timeago.js";

import './ProductDetails.css';
import { UserContext } from '../../App';
function ProductDetails() {
  const [userDetails,setUserDetails] = useState()
  const [data,setData] = useState()
  const { productId } = useParams();
  const { state, dispatch } = useContext(UserContext);


useEffect(() => {
    if (!sessionStorage.getItem("user")) {
      navigate("/login");
    }
  }, []);

useEffect(()=>{
    const fetchData = async () => {
        const {data} = await axios.get(`/getdetails/${productId}`,{
            headers: {
              Authorization: "Bearer " + sessionStorage.getItem("jwt"),
            }})

        console.log(data);
        setData(data)
    }
    fetchData()
},[])

  return (
    <>
    {data ? (
    <div>

    <MarketPlaceNav/>
    <div className="viewParentDiv">
      <div className="imageShowDiv">
        <img
          src={data.product.photo}
          alt="no"
          />
      </div>
      <div className="rightSection">
        <div className="productDetails">
          <p>&#x20B9;{data.product.price}</p>
          <span>{data.product.title}</span>
          <p>{data.product.category}</p>
          <p>{data.product.description}</p>
          <span>{format(data.product.createdAt)}</span>
        </div>

      <div className="contactDetails">
          <p>Seller details</p>
          <Link to={data.product.postedBy._id !== state._id
                          ? "/profile/" + data.product.postedBy._id
                          : "/profile"}>
          <p>{data.product.postedBy.name}</p>
          </Link>
        </div>
        
      </div>
    </div>
          </div>
    ) : (
        <p>Loading...</p>
    )}
    </>
  );
}
export default ProductDetails;