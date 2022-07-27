const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../keys')



router.post('/adminlogin', (req, res) => {
    try {       
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(422).json({ err: "please add email or password" })
        }
    
        if(email == "admin@admin.com" && password == "asdf"){
            return res.json("success")
        }else{
            return res.status(422).json({ error: 'invalid email or password' })
        }
    } catch (error) {
        console.log(error);
    }
})

module.exports = router
