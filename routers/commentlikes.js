const express=require('express')
const router=express.Router();
const User=require('../model/user')
const Notification=require('../model/notification');
const Comment=require('../model/comment');
const Post=require('../model/post')
function isloggedin(req,res,next){
    if(req.isAuthenticated())
    {
        return next();
    }
    res.redirect('/login')
}
function isAuthorComment(req,res,next){
    Comment.findById(req.params.id,(err,post)=>{
        if(post.user.equals(req.user._id))
        return next();
        return res.redirect('/landing')
    })
}
router.post('/comment/:id/:a',isloggedin,(req,res)=>{
    Comment.create({text:req.body.comment,author:req.user.username,user:req.user},(err,comment)=>{
        Post.findById(req.params.id,(err,post)=>{
            post.comments.unshift(comment)
            post.save()
            if(req.params.a=='landingpage')
            res.redirect('/landing')
            else
            res.redirect('/posts/'+req.user._id)
        })
    })
})
router.get('/deletecomment/:id/:a',isloggedin,isAuthorComment,(req,res)=>{
    Comment.findByIdAndDelete(req.params.id,(err)=>{
        if(req.params.a=='landingpage')
        res.redirect('/landing')
        else
        res.redirect('/posts/'+req.user._id)
    })
})
router.post('/like/:id/:a',isloggedin,function(req,res){
    var x=0;
    Post.findById(req.params.id,(err,post)=>{
        post.likes.forEach(function(user){
              if(req.user._id.equals(user._id)){
                  x=1;
              post.likes.pull(req.user._id)
              }
        })
        if(x==0)
        {
        post.likes.push(req.user._id);
        }
        post.save(function(err,post){
            if(req.params.a=='landingpage')
            res.redirect('/landing')
            else
            res.redirect('/posts/'+req.user._id)
        })
    })
})
router.get('/likes/:id',isloggedin,(req,res)=>{
    Post.findById(req.params.id).populate('likes').exec((err,post)=>{
        res.render('seelikes',{post:post})
    })
})
module.exports=router