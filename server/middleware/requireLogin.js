const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../keys')
const mongoose = require('mongoose')
const User = mongoose.model('User')

module.exports = (req,res,next)=>{
    console.log('calledhgvhv');
    const {authorization} = req.headers
    if(!authorization){
        return res.status(401).json({error:'you must be logged in 1'})
    }
    const token = authorization.replace("Bearer ","")
    console.log(token);
    jwt.verify(token,JWT_SECRET,(err,payload)=>{
        if(err){
            return res.status(401).json({error:"you must be logged in 2"})
        }else{

            const {_id} = payload
            console.log('payload',payload);
            User.findById(_id).then((userData)=>{
                req.user = userData
            next()
            })

        }

    })
}