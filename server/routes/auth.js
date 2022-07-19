const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../keys')
const requireLogin = require('../middleware/requireLogin')


router.post('/signup', (req, res) => {
    console.log(req.body);
    const { name, email, password,pic } = req.body
    if (!email || !password || !name) {
        return res.status(422).json({error: "please fill the details"})
    }

    User.findOne({ email: email }).then((savedUser) => {
        if (savedUser) {
            return res.status(422).json({ error: "user already exists with that email" })
        }

        bcrypt.hash(password, 12).then((hashedPassword) => {
            const user = new User({
                email,
                password: hashedPassword,
                name,
                pic
            })

            user.save().then((user) => {
                res.json({ message: 'saved successfully' })
            }).catch((err) => {
                console.log(err);
                if(err.code === 11000){
                    return res.status(422).json({ error: "user name already taken" })
                }
            })
        })

    }).catch(() => {
        console.log(err);
    })

})

router.post('/login', (req, res) => {
    console.log(req.body);
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(422).json({ err: "please add email or password" })
    }
    User.findOne({ email: email }).then((savedUser) => {
        if (!savedUser) {
            return res.status(422).json({ error: 'invalid email or password' })
        }
        bcrypt.compare(password, savedUser.password).then((doMatch) => {
            if (doMatch) {
                // res.json({ message: "successfully  signed" })
                const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
                const {_id,name,email,followers,following,pic} = savedUser
                res.json({token,user:{_id,name,email,followers,following,pic},type:"user"})
            } else {
                return res.status(422).json({ error: 'invalid email or password' })
            }
        }).catch((err) => {
            console.log(err);
        })
    })
})

module.exports = router