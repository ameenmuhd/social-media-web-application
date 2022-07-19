const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../keys')



router.post('/adminlogin', (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(422).json({ err: "please add email or password" })
    }

    if(email == "admin@admin.com" && password == "asdf"){
        return res.json("success")
    }else{
        return res.status(422).json({ error: 'invalid email or password' })
    }
    // User.findOne({ email: email }).then((savedUser) => {
    //     if (!savedUser) {
    //         return res.status(422).json({ error: 'invalid email or password' })
    //     }
    //     bcrypt.compare(password, savedUser.password).then((doMatch) => {
    //         if (doMatch) {
    //             // res.json({ message: "successfully  signed" })
    //             const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
    //             const {_id,name,email} = savedUser
    //             res.json({token,user:{_id,name,email}})
    //         } else {
    //             return res.status(422).json({ error: 'invalid email or password' })
    //         }
    //     }).catch((err) => {
    //         console.log(err);
    //     })
    // })
})

module.exports = router
