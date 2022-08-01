const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { default: mongoose } = require('mongoose');
const {JWT_SECRET} = require('../keys')
const Category = mongoose.model('Category')



router.post('/adminlogin', (req, res) => {
    try {       
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(422).json({ err: "please add email or password" })
        }
    
        if(email == "admin@admin.com" && password == "asdf"){
            const token = jwt.sign({_id:"1234567"},JWT_SECRET)
            return res.json({type:"admin",token})
        }else{
            return res.status(422).json({ error: 'invalid email or password' })
        }
    } catch (error) {
        console.log(error);
    }
})

router.post('/addcategory',(req,res)=>{
    try {
        console.log(req.body);
        const category = new Category({
            name : req.body.category
          });
        category.save({new:true}).then((result)=>{
            res.json({category:result})
        }).catch((err)=>{
            console.log(err);
            if(err.code === 11000){
                return res.status(422).json({ error: "category already created" })
            }
        })
    } catch (error) {
        console.log('....................',error);
    }
})

router.get('/allcategory',(req,res)=>{
    try {
        Category.find().then(category=>{
            res.json({category})
        }).catch((err)=>{
            console.log(err);
        })
    } catch (error) {
        console.log(error);
    }
})

router.delete('/deletecategory/:id',(req,res)=>{
    try {
        Category.findOne({_id:req.params.id})
        .exec((err,category)=>{
            if(err || !category){
                return res.status(422).json({error:err})
            }
            if(category){
                category.remove().then(result=>{
                    res.json(result)
                }).catch(err=>{
                    console.log(err);
                })
            }
        })
    } catch (error) {
        console.log(error);
    }
})

module.exports = router
