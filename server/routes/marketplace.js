const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const User = mongoose.model("User");
const Product = mongoose.model("Product");

router.post("/sellproduct", requireLogin, (req, res) => {
  try {
    console.log(req.body);
    const { title, url, category, location, description, price } = req.body;
    if (!title || !url || !category || !location || !description || !price) {
      return res.status(422).json({ error: "Please add all the fiels" });
    }

    const product = new Product({
      title,
      photo: url,
      postedBy: req.user,
      price,
      location,
      description,
      category,
    });
    product
      .save()
      .then((result) => {
        res.json({ result });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.log(error);
  }
});

router.get("/allproducts", requireLogin, (req, res) => {
  try {
    Product.find()
      .populate("postedBy", "_id name pic")
      .sort({ createdAt: -1 })
      .then((products) => {
        res.json({ products });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.log(error);
  }
});

router.get("/getdetails/:id", requireLogin, (req, res) => {
  try {
    Product.findOne({ _id: req.params.id })
      .populate("postedBy", "name")
      .exec((err, product) => {
        if (err || !product) {
          return res.status(422).json({ error: err });
        }
        if (product) {
          res.json({ product });
        }
      });
  } catch (error) {
    console.log(error);
  }
});

router.get("/getmyads/:id", requireLogin, (req, res) => {
  try {
    console.log(req.params);
    Product.find({ postedBy: req.params.id })
      .populate("postedBy", "name pic createdAt")
      .exec((err, products) => {
        if (err || !products) {
          return res.status(422).json({ error: err });
        }
        if (products) {
          res.json({ products });
        }
      });
  } catch (error) {
    res.status(422).json({ error: "some error occured" });
  }
});

router.get('/deleteproduct/:postId',(req,res)=>{
  try {
    Product.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }
        if(post){
            post.remove().then(result=>{
                res.json(result)
            }).catch(err=>{
                console.log(err);
            })
        }
    })
  } catch (error) {
    res.status(422).json({err:"some error"})
  }
})

router.post('/updatemyproduct',async (req,res)=>{
  console.log(req.body);
  try {
    const {title,location,price,description} = req.body
    await Product.findByIdAndUpdate({"_id":req.body.productId},{
      title,
      price,
      location,
      description
    },{new:true}).then((result)=>{
      res.json({success:true})
    }).catch((error)=>{
      res.status(422).json(error)
    })
  } catch (error) {
    console.log(error);
  }
})

module.exports = router;
