const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const User = mongoose.model("User");
const Product = mongoose.model("Product");

router.post('/sellproduct',requireLogin,(req,res)=>{
    try {
        console.log(req.body);
        const {title,url,category,location,description,price} = req.body
        if(!title || !url || !category || !location || !description || !price){
            return res.status(422).json({error:"Please add all the fiels"})
        }
    
        const product = new Product({
            title,
            photo:url,
            postedBy: req.user,
            price,
            location,
            description,
            category
        })
        product.save().then((result)=>{
            res.json({result})
        }).catch((err)=>{
            console.log(err);
        })
        
    } catch (error) {
        console.log(error);
    }
})

router.get('/allproducts',requireLogin,(req,res)=>{
    try {
        Product.find().populate("postedBy","_id name pic").sort({createdAt:-1}).then(products=>{
            res.json({products})
        }).catch((err)=>{
            console.log(err);
        })
    } catch (error) {
        console.log(error);
    }
})

router.get('/getdetails/:id',requireLogin,(req,res)=>{
    try {
        Product.findOne({ _id: req.params.id })
        .populate('postedBy','name')
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
})


module.exports = router;