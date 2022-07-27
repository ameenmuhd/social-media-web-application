const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const Post = mongoose.model("Post");
const User = mongoose.model("User");
const bcrypt = require('bcryptjs')

router.get("/user/:id", requireLogin, (req, res) => {
  User.findOne({ _id: req.params.id })
    .select("-password")
    .then((user) => {
      Post.find({ postedBy: req.params.id })
        .populate("postedBy", "_id name")
        .exec((err, posts) => {
          if (err) {
            return res.status(422).json({ error: err });
          }
          res.json({ user, posts });
        });
    })
    .catch((err) => {
      return res.status(404).json({ error: "User not found" });
    });
});

router.put("/follow", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.followId,
    {
      $push: { followers: req.user._id },
    },
    {
      new: true,
    },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $push: { following: req.body.followId },
        },
        {
          new: true,
        }
      )
        .select("-password")
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    }
  );
});

router.put("/unfollow", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.unfollowId,
    {
      $pull: { followers: req.user._id },
    },
    {
      new: true,
    },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { following: req.body.unfollowId },
        },
        {
          new: true,
        }
      )
        .select("-password")
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    }
  );
});

router.get("/edituser/:id", requireLogin, (req, res) => {
  console.log("inside called", req.params);
  User.findOne({ _id: req.params.id })
    .select("-password")
    .exec((err, user) => {
      if (err || !user) {
        return res.status(422).json({ error: err });
      }
      if (user) {
        res.json({ user });
      }
    });
});

router.put("/updateuser", requireLogin, (req, res) => {
  console.log("inside called", req.body);
  const { name, userId } = req.body;
  User.findByIdAndUpdate(
    userId,
    {
      name: name,
    },
    {
      new: true,
    }
  ).select("-password").then((result) => {
    res.json(result);
  }).catch((err)=>{
    console.log(err)
    if(err.code === 11000){
      return res.status(422).json({ error: "user name already taken" })
  }
  })
});

router.put('/updatepassword',requireLogin,(req,res)=>{
  const { oldPassword,newPassword,userId } = req.body
    if (!oldPassword || !newPassword) {
        return res.status(422).json({error: "please fill the details"})
    }

    User.findOne({ _id: userId }).then((savedUser) => {
      console.log(savedUser);
      if (!savedUser) {
          return res.status(422).json({ error: 'some error occured try again after sometime' })
      }
      bcrypt.compare(oldPassword, savedUser.password).then((doMatch) => {
          if (doMatch) {
            bcrypt.hash(newPassword, 12).then((hashedPassword) => {
              User.findByIdAndUpdate(
                userId,
                {
                  password: hashedPassword,
                },
                {
                  new: true,
                }
              ).then((result) => {
                res.json({msg:"password changed successfully"});
              });
              
          })
          } else {
              return res.status(422).json({ error: 'please check your old password and try again' })
          }
      }).catch((err) => {
          console.log(err);
      })
  })
})

router.put('/updatepic',requireLogin,(req,res)=>{
  User.findByIdAndUpdate({_id:req.user._id},{$set:{pic:req.body.pic}},{new:true},(err,result)=>{
    if(err){
      return res.status(422).json({err})
    }else{
      return res.json(result)
    }
  })
})

router.post('/search-users',requireLogin,(req,res)=>{
  console.log(req.body);
  try {
    let userPattern = new RegExp('^'+req.body.query)
    User.find({name:{$regex:userPattern}}).select('-password')
    .then((user)=>{
      res.json({user})
    }).catch(err=>{
      console.log(err);
    })
  } catch (error) {
    console.log(error);
  }
})

router.get('/search-users-chat',requireLogin,async (req,res)=>{
  try {   
    console.log(req.query);
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
  
      const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users);
  } catch (error) {
    console.log(error);
  }
})

module.exports = router;
