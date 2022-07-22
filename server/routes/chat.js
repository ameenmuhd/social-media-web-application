const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const Post = mongoose.model("Post");
const User = mongoose.model("User");
const Chat = mongoose.model("Chat");

router.get('/chatcontacts/:id',requireLogin,async (req,res)=>{
    try {
        const users = await User.findOne({_id:req.params.id})
        .select("following")
        .populate('following',"_id pic name")
        .exec((err,users)=>{
            if (err) {
                return res.status(422).json({ error: err });
              }
              res.json(users);
        })
    } catch (error) {
        res.status(500).json(error)
    }
})

router.post('/addmsg',requireLogin,async (req,res)=>{
    try {
        const {from,to,message} = req.body
        const data = await Chat.create({
            message:{text:message},
            users:[from,to],
            sender: from,
        })
        if(data){
            return res.json({msg: 'Message addedd successfully'})
        }else{
            return res.json({msg:"Failed to add message to database"})
        }
        
    } catch (error) {
        res.status(500).json(error)
    }
})

router.post('/getmsg',requireLogin,async (req,res)=>{
    try {
        const {from,to} = req.body
        const messages = await Chat.find({
            users:{
                $all: [from,to]
            }
        }).sort({updatedAt:1})
        const projectedMessages = messages.map((msg)=>{
            return{
                fromSelf:msg.sender.toString() === from,
                message: msg.message.text,
                createdAt: msg.createdAt
            }
        })
        res.json(projectedMessages)
    } catch (error) {
        res.status(500).json(error)
    }
})
module.exports = router;