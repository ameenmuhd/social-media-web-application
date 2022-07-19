const { text } = require('express');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model('Post')

router.get('/allpost',requireLogin,(req,res)=>{
    Post.find().populate("postedBy","_id name pic").populate("comments.postedBy","_id name").sort({createdAt:-1}).then(posts=>{
        res.json({posts})
    }).catch((err)=>{
        console.log(err);
    })
})

router.get('/getsubpost',requireLogin,(req,res)=>{
    Post.find({postedBy:{$in:req.user.following}}).populate("postedBy","_id name").populate("comments.postedBy","_id name").sort({createdAt:-1}).then(posts=>{
        res.json({posts})
    }).catch((err)=>{
        console.log(err);
    })
})

router.post('/createpost',requireLogin,(req,res)=>{
    const {title,pic} = req.body
    if(!title || !pic){
        return res.status(422).json({error:"Please add all the fiels"})
    }

    req.user.password = undefined

    const post = new Post({
        title,
        photo:pic,
        postedBy: req.user
    })
    post.save().then((result)=>{
        res.json({post:result})
    }).catch((err)=>{
        console.log(err);
    })
})

router.get('/mypost',requireLogin,(req,res)=>{
    console.log(req.user);
    Post.find({postedBy:req.user._id}).populate("postedBy","_id name")
    .then((myposts)=>{
        res.json({myposts})
    }).catch((err)=>{
        console.log(err);
    })
})

router.put('/like',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{
        new:true
    })
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id name pic")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.put('/unlike',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true
    })
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id name pic")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.put('/comment',requireLogin,(req,res)=>{
    const comment = {
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id name pic")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.delete('/deletepost/:postId',requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){
            post.remove().then(result=>{
                res.json(result)
            }).catch(err=>{
                console.log(err);
            })
        }
    })
})

router.get('/editpost/:postId',requireLogin,(req,res)=>{
    console.log(req.params.postId);
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }
        if(post){
            console.log(post);
            res.json({post})
        }
    })
})

router.put('/updatepost',requireLogin,async(req,res)=>{
    const {title,pic,postId} = req.body
    console.log('sdsad',title,postId,pic);

    if(!pic){
        await   Post.findByIdAndUpdate({"_id":postId},{
           title: title
        }
           ,{
               new:true,
           }).then(result=>{
               res.json(result)
           })
    }else{
        await   Post.findOneAndUpdate({"_id":postId},{
            "$set":{"title": title,
            "photo":pic}
         }
            ,{
                new:true,
            }).then(result=>{
                res.json(result)
            })
    }
})

router.delete('/deletecomment/:postId/:commentId',requireLogin, (req, res) => {
    Post.findById(req.params.postId)
    //   .populate("postedBy","_id name")
      .populate("comments.postedBy","_id name")
      .exec((err,post)=>{
          if(err || !post){
            return res.status(422).json({message:"Some error occured!!"});
          }
          const comment = post.comments.find((comment)=>
            comment._id.toString() === req.params.commentId.toString()
            );
            if (comment.postedBy._id.toString() === req.user._id.toString()) {
                const removeIndex = post.comments
                .map(comment => comment.postedBy._id.toString())
                .indexOf(req.user._id);
                post.comments.splice(removeIndex, 1);
                post.save()
                .then(result=>{
                    res.json(result)
                }).catch(err=>console.log(err));
            }
      })
  });

module.exports = router