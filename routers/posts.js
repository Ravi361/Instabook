const express=require('express')
const router=express.Router();
const User=require('../model/user')
const Notification=require('../model/notification');
const Comment=require('../model/comment');
const Post=require('../model/post')
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params:{
      folder: 'hreview',
      allowedFormats:['jpeg','png','jpg']
    }
  });
const upload=multer({storage})
function isloggedin(req,res,next){
    if(req.isAuthenticated())
    {
        return next();
    }
    res.redirect('/login')
}
function isAuthor(req,res,next){
    Post.findById(req.params.id,(err,post)=>{
        if(post.user.equals(req.user._id))
        return next();
        return res.redirect('/login')
    })
}
router.get('/posts/:id',isloggedin,(req,res)=>{
    User.findById(req.params.id).populate({path:'post',
    populate: { path: 'comments likes' }}).exec((err,user)=>{
        res.render('seeposts',{user:user})
    })
})
router.post('/newpost/:id',isloggedin,upload.single('image'),(req,res)=>{
    const x={}
    x.text=req.body.text
    x.user=req.user
    x.image={url:req.file.path,filename:req.file.filename}
        Post.create(x, function(err,post) {
            User.findById(req.params.id,(err,user)=>{
                user.post.unshift(post);
                user.save();
                res.redirect('/landing')
            })
        })
})
router.get('/deletepost/:id',isloggedin,isAuthor,async(req,res)=>{
    const post=await Post.findById(req.params.id)
    await cloudinary.uploader.destroy(post.image.filename)
    for(let comment of post.comments)
    await Comment.findByIdAndDelete(comment)
    await Post.findByIdAndDelete(req.params.id)
    res.redirect('/landing')
})
module.exports=router